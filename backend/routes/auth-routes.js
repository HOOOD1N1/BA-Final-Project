const router = require('express').Router();
const passport = require('passport');

//google auth
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload);
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
}


//



// auth login


// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    res.send('logging out');
});

// auth with google+
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.send(req.user);
    console.log('works')
});

router.post('/google_login', (req, res) => {
    verify(req.body.id).catch(console.error);
    //console.log(req.body.id)
    const response = {
        id: req.body.id
    }
    res.send(JSON.stringify(response));
})

module.exports = router;