const router = require('express').Router();


router.get('/contacts/:userId', async(req, res) => {
    const { userId } = req.params;
    res.send();
})









modules.exports = router;