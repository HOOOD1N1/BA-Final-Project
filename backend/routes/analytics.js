const router = require('express').Router();
const { pool } = require("../config/db/db")

router.get('/analytics/global', async(req, res) => {
    let results_posts = await pool.query(`select posts.author_id, "Users".username, count(*) 
	from posts 
	join "Users" on "Users".id = posts.author_id
  where posts.author_id 
  in (select id from "Users") 
 group by "Users".id, posts.author_id;`)


    let results_comments = await pool.query(`select comments.author_id, "Users".username, count(*) 
 from comments 
 join "Users" on "Users".id = comments.author_id
where comments.author_id 
in (select id from "Users") 
group by "Users".id, comments.author_id;`)


    let results_reviews = await pool.query(`select reviews.author_id, "Users".username, count(*) 
from reviews 
join "Users" on "Users".id = reviews.author_id
where reviews.author_id 
in (select id from "Users") 
group by "Users".id, reviews.author_id;`)

    console.log('posts', results_posts.rows)
    console.log('comments', results_comments.rows)
    console.log('reviews', results_reviews.rows)
    res.send(JSON.stringify({
        posts: results_posts.rows,
        comments: results_comments.rows,
        reviews: results_reviews.rows
    }))
})

router.get('/analytics/cards', async(req, res) => {
    let best_post = await pool.query(`SELECT title, posts.id as postid ,posts.creation_date,content,author_id as id, username, profile_image,likes 
    FROM posts 
    JOIN "Users" 
    ON "Users".id=author_id  
    ORDER BY likes DESC
    LIMIT 3;
    `)
    console.log(best_post.rows[0], best_post.rows[1], best_post.rows[2])
    res.send(JSON.stringify({
        first_post: best_post.rows[0],
        second_post: best_post.rows[1],
        third_post: best_post.rows[2]
    }))
})

module.exports = router;