const express = require('express')
const app = express()
const cors = require("cors")
const socketIo = require("socket.io");
const http = require('http')
const fs = require('fs')
const User = require("./controllers/User")
const multiparty = require("connect-multiparty");
const { json } = require("body-parser")
const { pool } = require("./config/db/db")
var multer = require('multer')
const cryptoRandomString = require('crypto-random-string');
const { query } = require('express');
const { type } = require('os');
const chatRouter = require('./routes/chat-routes');
const analyticsRouter = require('./routes/analytics');
const Namespace = require('./controllers/Namespace')
const Session = require("./controllers/Sessions.js")

var upload = multer({
    storage: multer.diskStorage({
        destination: './photos/',
        filename: function(req, file, cb) {
            //req.body is empty...
            //How could I get the new_file_name property sent from client here?
            let newToken = cryptoRandomString({ length: 10, type: 'hex' });
            console.log(file)
            cb(null, newToken + "." + file.mimetype.split('/')[1]);
        }
    })
})
const PORT = "8888"

const MultiPartyMiddleWare = multiparty({ uploadDir: './photos' });

app.use(cors())
app.use(json())
app.use('/photos', express.static(`${__dirname}/photos/`))
app.use(analyticsRouter)

app.post('/ckuploads', MultiPartyMiddleWare, (req, res) => {
    console.log("Files to upload are ", req.files.upload);
    let x = req.files.upload.path;
    let y = x.split('\\');
    let path = y[1];
    res.send({ "uploaded": "true", "url": `http://localhost:8888/photos/${path}` })
})
app.use(chatRouter);
app.post('/photo/:id', upload.single('uploaded_file'), async(req, res) => {
    // console.log(JSON.stringify(req.file))
    console.log(req.file.filename)
    try {
        const result = await pool.query(`UPDATE "Users" set profile_image=$1 where id=${req.params.id}
         returning profile_image;`, [req.file.filename])
        if (result) {
            console.log(result.rows[0])
            res.send(JSON.stringify({ photo: `http://localhost:8888/photos/${result.rows[0].profile_image}` }));
        }
    } catch (error) {
        console.log(error);
    }

})
app.get('/check/friend/:userId/:friend', async(req, res) => {
    //const { friend } = req.body;
    //console.log('body is ' + friend)
    const userId = req.params.userId;
    const friend = req.params.friend;
    console.log("my friend is" + friend)
    const result = await pool.query(`SELECT id FROM friends WHERE
     userid1=$1 AND userid2=$2 OR userid1=$2 AND userid2=$1`, [friend, userId]);
    if (result.rowCount === 1) {
        let message = {
            check: true
        };
        res.send(JSON.stringify(message))
    } else {
        let message = {
            check: false
        };
        res.send(JSON.stringify(message))
    }
})
app.get('/handleFriend/:userId/:friend', async(req, res) => {
    console.log("ENTERS, MAYBE")
    let userId = req.params.userId;
    let friend = req.params.friend;
    let check = await pool.query('SELECT id FROM friends WHERE userid1=$1 AND userid2=$2 OR userid1=$2 AND userid2=$1', [friend, userId]);
    if (check.rowCount === 1) {
        console.log("ENTERS AND DELETES")
        await pool.query('DELETE FROM friends WHERE userid1=$1 AND userid2=$2 OR userid1=$2 AND userid2=$1', [friend, userId])
        res.send(JSON.stringify({
            message: 'FRIENDSHIP_DELETED'
        }))
    } else {
        console.log("ENTERS AND INSERTS")
        await pool.query('INSERT INTO friends (userid1, userid2) VALUES ($1, $2)', [friend, userId])
        res.send(JSON.stringify({
            message: 'FRIENDSHIP_ADDED'
        }))
    }
})

//taskbar
app.get('/taskbar/photo/:userId', async(req, res) => {
    let userId = req.params.userId;
    try {
        let result = await pool.query('SELECT profile_image, username from "Users" WHERE id=$1;', [userId]);
        if (result.rows) {
            console.log(result.rows)
            res.json(result.rows);
        }
    } catch (error) {
        console.log(error);
        res.send(error);
    }

})
app.get('/query/search', async(req, res) => {
    let value = req.query.value;
    let result = await pool.query(`select id, username as name, profile_image as image from "Users" where username like '${value}%';`)
    console.log(result.rows)
    if (result.rows) res.send(JSON.stringify({ results: result.rows }))
})

app.post('/main/user/:id', async(req, res) => {
    var userId = req.params.id;
    console.log(userId);
    try {
        const result = await pool.query('SELECT username,profile_image FROM "Users" WHERE id=$1;', [userId]);
        if (result) {
            console.log(result.rows[0])
            res.status(200).send(JSON.stringify(result.rows[0]))
        }
    } catch (error) {
        res.send({
            status: 'ERROR',
            message: 'MAIN_USERNAME_RETRIEVAL_ERROR'
        })
        res.send(error)
    }


})

app.get('/analytics/:userId', async(req, res) => {
        let userId = req.params.userId;
        try {
            let totalPostsResult = await pool.query(`select count(*) from posts`);
            let postsResult = await pool.query(`select count(id) from posts where author_id=${userId}`);
            //console.log("this is the results " + postsResult.rows[0].count);
            let totalCommentsResult = await pool.query(`select count(*) from comments`);
            let commentsResult = await pool.query(`select count(id) from comments where author_id=${userId}`);

            let totalReviewsResult = await pool.query(`select count(*) from reviews`);
            let reviewsResult = await pool.query(`select count(id) from reviews where author_id=${userId}`);

            res.json({
                totalPosts: totalPostsResult.rows[0].count,
                totalComments: totalCommentsResult.rows[0].count,
                totalReviews: totalReviewsResult.rows[0].count,
                postsResult: postsResult.rows[0].count,
                commentsResult: commentsResult.rows[0].count,
                reviewsResult: reviewsResult.rows[0].count,
            })
        } catch (error) {
            console.log(error)
        }
    })
    //delete session
app.delete('/clear/:userId', async(req, res) => {
        const userId = req.params.userId;
        await pool.query(`DELETE FROM sessions WHERE user_id=${userId};`)
        res.status(200).send();
    })
    //check if sessions already exists
app.post('/session/validate/:userId', async(req, res) => {
    const { sessionToken } = req.body;
    const { userId } = req.params
    const result = await pool.query(`SELECT id FROM sessions WHERE user_id=$1 AND session_token=$2;`, [userId, sessionToken])
    if (result.rowCount === 1) {
        res.send(JSON.stringify({ 'status': 'success', message: 'VALID_SESSION' }));
    } else {
        res.send(JSON.stringify({ 'status': 'error', message: 'INVALID_SESSION' }));
    }
    //res.send()
})

app.post('/:user/posts', async(req, res) => {
    var id = req.params.user;
    try {
        var results = await pool.query(`SELECT content, profile_image, title, posts.creation_date,
         posts.id as postId, "Users".username, "Users".id from posts join "Users" 
         on posts.author_id = "Users".id where "Users".id=$1 ORDER BY creation_date DESC;`, [id]);
        if (results) {
            res.send({
                status: 'success',
                message: 'USER_POSTS_RETRIEVED',
                posts: JSON.stringify(results.rows)
            })
        }
    } catch (error) {
        res.send({
            status: 'failed',
            message: 'USERS_POSTS_ERROR'
        })
        res.send(error);
    }
})

app.post('/user/:user/comments', async(req, res) => {
    var id = req.params.user;
    try {
        var results = await pool.query(`SELECT content, profile_image, comments.creation_date,
         comments.id as postId, "Users".username, "Users".id from comments join "Users" 
         on comments.author_id = "Users".id where "Users".id=$1 ORDER BY creation_date DESC;`, [id]);
        if (results) {
            res.send({
                status: 'success',
                message: 'USER_COMMENTS_RETRIEVED',
                posts: JSON.stringify(results.rows)
            })
        }
    } catch (error) {
        res.send({
            status: 'failed',
            message: 'USERS_COMMENTS_ERROR'
        })
        res.send(error);
    }
})

app.post('/user/:user/reviews', async(req, res) => {
    var id = req.params.user;
    try {
        var results = await pool.query(`SELECT content,profile_image,review, reviews.creation_date,
         reviews.id as postId, "Users".username, "Users".id from reviews join "Users" 
         on reviews.author_id = "Users".id where "Users".id=$1 ORDER BY creation_date DESC;`, [id]);
        if (results) {
            res.send({
                status: 'success',
                message: 'USER_REVIEWS_RETRIEVED',
                posts: JSON.stringify(results.rows)
            })
        }
    } catch (error) {
        res.send({
            status: 'failed',
            message: 'USERS_REVIEWS_ERROR'
        })
        res.send(error);
    }
})

app.post('/posts', async(req, res) => {
    try {
        var results = await pool.query(`SELECT content, title, profile_image, posts.creation_date, posts.id as postId, "Users".username,
         "Users".id from posts join "Users" on posts.author_id = "Users".id ORDER BY creation_date DESC;`);
        if (results) {

            res.send({
                status: 'success',
                message: 'POSTS_RETRIEVED',
                posts: JSON.stringify(results.rows)
            })
        }

    } catch (error) {
        res.send({
            status: 'failed',
            message: 'POSTS_RETRIEVED_ERROR'
        })
        res.send(error);
    }
})

app.post('/post/:postId/comments', async(req, res) => {
    var postId = req.params.postId;
    try {

        var results = await pool.query(`SELECT content, profile_image, comments.creation_date,
         comments.id as postId, "Users".username, "Users".id from comments
        join "Users" on comments.author_id = "Users".id WHERE comments.post_id = $1 ORDER BY creation_date;`, [postId]);
        if (results) {

            res.send({
                status: 'success',
                message: 'COMMENTS_RETRIEVED',
                posts: JSON.stringify(results.rows)
            })
        }

    } catch (error) {
        res.send({
            status: 'failed',
            message: 'COMMENTS_RETRIEVED_ERROR'
        })
        res.send(error);
    }
})

app.post('/post/:postId/reviews', async(req, res) => {
    var postId = req.params.postId;
    try {
        var results = await pool.query(`SELECT content,profile_image, reviews.creation_date,reviews.review, reviews.id as postId,
         "Users".username, "Users".id from reviews join "Users" on reviews.author_id = "Users".id WHERE reviews.post_id = $1
          ORDER BY creation_date ;`, [postId]);
        if (results) {
            res.send({
                status: 'success',
                message: 'REVIEWS_RETRIEVED',
                posts: JSON.stringify(results.rows)
            })
        }
    } catch (error) {
        res.send({
            status: 'failed',
            message: 'REVIEWS_RETRIEVED_ERROR'
        })
        res.send(error);
    }
})

app.post('/editor/user/:id/:type', async(req, res) => {
    var userId = req.params.id;
    var type = req.params.type;
    console.log('enters here');
    var content = req.body.content;
    console.log(req.body.content);
    if (type === 'post') {
        console.log('enters post');
        let title = req.body.title;
        try {
            await pool.query(`INSERT INTO posts(author_id, content, title) VALUES ($1, $2, $3);`, [userId, content, title]);
            res.send({
                status: 'success',
                message: 'TEXT_POSTED'
            })
        } catch (error) {
            res.send({
                status: 'failed',
                message: 'TEXT_POST_ERROR'
            })
            res.send(error);
        }

    } else if (type === 'comment') {
        var userId = req.params.id;
        var postId = parseInt(req.body.postId);
        console.log(`enters comment ${postId} ${userId} ${content}`);
        try {
            await pool.query(`INSERT INTO comments(post_id, author_id, content) VALUES ($1, $2, $3);`, [postId, userId, content]);
            res.send({
                status: 'success',
                message: 'COMMENT_POSTED'
            })
        } catch (error) {
            console.log(error);
            res.send({
                status: 'failed',
                message: 'COMMENT_POST_ERROR'
            })
            res.send(error);
        }

    } else if (type === 'review') {
        var userId = req.params.id;
        var review = req.body.review;
        var postId = req.body.postId;
        console.log(`enters review ${postId} and value ${review}`);
        try {
            await pool.query(`INSERT INTO reviews(post_id, author_id, content, review) VALUES ($1, $2, $3, $4);`, [postId, userId, content, review]);
            res.send({
                status: 'success',
                message: 'REVIEW_POSTED'
            })
        } catch (error) {
            console.log(error);
            res.send({
                status: 'failed',
                message: 'REVIEW_POST_ERROR'
            })
            res.send(error);
        }

    }
});


app.post('/userprofile/user/:id', async(req, res) => {
    var userId = req.params.id;

    try {
        const result1 = await pool.query(`SELECT username, profile_image FROM "Users" WHERE id=${userId};`);
        const result2 = await pool.query(`SELECT count(*) as comment_count from comments where author_id=${userId};`);
        const result3 = await pool.query(`SELECT count(*) as posts_count FROM posts WHERE author_id=${userId};`);
        const result4 = await pool.query(`SELECT count(*) as reviews_count FROM reviews WHERE author_id=${userId};`);
        if (result1 && result2 && result3 && result4) {
            const username = result1.rows[0];
            const comments = result2.rows[0];
            const posts = result3.rows[0];
            const reviews = result4.rows[0];
            const payload = {
                profile_image: username.profile_image,
                username: username.username,
                comments,
                posts,
                reviews
            };
            res.status(200).send(payload)
        }
    } catch (error) {
        console.log(error);
        res.send({
            status: 'failed',
            message: 'USER_INFO_RETRIEVAL_ERROR',
            error: error
        })
        res.send(error)
    }


})
app.post('/:type/like/:postId/:userId', async(req, res) => {
    var userId = req.params.userId;
    var postId = req.params.postId;
    var type = req.params.type;
    try {
        let exists = await pool.query(`select id from likes where post_id=${postId} and author_id=${userId}`);
        console.log(exists.rows[0])
        if (exists.rows[0]) {
            let x = exists.rows[0];
            await pool.query(`delete from likes where id=${x.id}`);
            let likeResult = await pool.query(`update ${type} set likes = likes - 1 where id=${postId} returning likes;`)
            if (likeResult) {

                res.status(200).send(likeResult.rows[0])
            }
        } else {
            await pool.query(`insert into likes (post_id, author_id) values (${postId}, ${userId})`);
            let likeResult = await pool.query(`update ${type} set likes = likes + 1 where id=${postId} returning likes;`)
            if (likeResult) {
                res.status(200).send(likeResult.rows[0])
            }
        }
    } catch (error) {
        console.log(error);
    }


});
app.post('/:type/likes/:postId', async(req, res) => {
    var postId = req.params.postId;
    var type = req.params.type;
    try {
        var likeResult = await pool.query(`select likes from ${type} where id=${postId};`)

        if (likeResult) {

            res.status(200).send(likeResult.rows[0])
        }
    } catch (error) {
        res.send(error);
    }


});

app.post('/users', async(req, res) => {
    //const id = parseInt(request.params.id)
    const { id, name, email } = req.body
    const password = 123;
    const date = new Date();
    const result = await pool.query(
        'INSERT INTO "Users" (id, username, email, password, creation_date) VALUES ($1, $2, $3, $4, $5)', [id, name, email, password, date])

    res.status(201).send(`User added with ID: ${result.insertId}`)

});
app.get('/users_all', async(req, res) => {
    const result = await pool.query('SELECT * FROM "Users";')
    res.status(201).json(result.rows)
});

app.post('/login', async(req, res, next) => {


    const { email, password } = req.body;
    const result = await User.authenticate({ email: email, password: password })
    console.log('here is payload' + JSON.stringify(result.payload));
    if (result) {
        res.send(JSON.stringify(result.payload));
    }
    next()

});

app.post('/register', async(req, res, next) => {
    const result = await User.create(req.body)
    console.log("result is " + JSON.stringify(result))
    if (result) {
        console.log("there is a result")
        const { status, message } = result;
        if (status === 'error') {
            res.status(500).send(result)
        } else {
            res.send(result)
        }
    }
    next()
})

// socket.io
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
app.post("/namespace/create", async(req, res) => {
    // console.log(req.headers)
    const splitted = req.headers.authorization.split('-')
    const authorizationObject = {
        userId: Number(splitted[0]),
        sessionId: Number(splitted[1]),
        sessionToken: splitted[2],
    }
    const createdNamespace = await Namespace.create(authorizationObject, io);
    res.send(
        JSON.stringify({
            status: createdNamespace === true ? "success" : "error",
        })
    );
});


server.listen(PORT, (err) => {

    console.log(`Listening to http://localhost:${PORT}`)

})