const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const GithubStrategy = require('passport-github2');
const localStrategy = require('passport-local');
//const bcrypt = require('bcrypt');
const db = require('./db/db');

passport.serializeUser((user, done) => {
    /* console.log(user)
     console.log('here should work')
     try {
         done(new Error("a crapat"), user.id); //first arg is the error

     } catch (err) {
         console.error(err)
     }
     console.log('here works?')
     */
    console.log('User::', user);
    done(null, user.id);
});
passport.deserializeUser(async(id, done) => {
    console.log(`deserialize ${id}`)


    await db.query('SELECT id FROM "Users" WHERE id=$1', [id])
    db.query(
        'SELECT id FROM "Users" WHERE id=$1', [id],
        (error, results) => {
            if (error) {
                throw new Error('Problemo numero 1')
            }
            console.log(results.rows[0])
            done(null, results.rows[0]); //first arg is the error




        })
});

passport.use(new GoogleStrategy({
    //options for the strategy
    callbackURL: 'http://localhost:9000/auth/google/redirect',
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET

}, (accesToken, refreshToken, profile, done) => {
    //passport callback function
    console.log('passport callback function fired')
    console.log(profile)
    db.query(
        `SELECT id FROM "Users" WHERE id=${profile.id}`,
        (error, results) => {
            console.log(results.rows[0])
            if (results.rows.length === 0) {
                const date = new Date();
                const password = Math.floor(Math.random() * 100000);
                //const hashedPassword = await bcrypt.hash(password, 10)
                db.query(
                        'INSERT INTO "Users" (id, username, password, creation_date) VALUES ($1, $2, $3, $4)', [profile.id, profile.displayName, 0, date],
                        (error, results) => {
                            console.log('here')
                            if (error) {
                                console.log('error')
                                throw new Error('Insert error')
                            } else {
                                console.log("works, sure")
                            }
                        }


                    )
                    //done(null, profile.id)
            } else {
                console.log(`Current user is id=${profile.id}`)

                console.log('works?')
            }
            done(null, profile.id)
        }
    )
}));