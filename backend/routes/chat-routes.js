const router = require('express').Router();
const { pool } = require("../config/db/db")


router.get('/contacts/:userId', async(req, res) => {
    const { userId } = req.params;
    console.log("ENTERS HERE, BOY")
    const result1 = await pool.query('SELECT userid2 as userid, username, profile_image FROM friends JOIN "Users" ON "Users".id=userid2 WHERE userid1=$1 ', [userId]);
    const result2 = await pool.query('SELECT userid1 as userid, username, profile_image FROM friends JOIN "Users" ON "Users".id=userid1 WHERE userid2=$1', [userId]);
    if (result1.rowCount > 0 && result2.rowCount === 0) {
        res.send({ results: [...result1.rows] });
    } else if (result1.rowCount === 0 && result2.rowCount > 0) {
        res.send({ results: [...result2.rows] });
    } else res.send({ results: [...result1.rows, ...result2.rows] })



})
module.exports = router;