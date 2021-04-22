var nodemailer = require('nodemailer');
let express = require('express');
let mailRouter = express.Router();


//send mail



mailRouter.post('/new-user', (err, req, res) => {

    let transport = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: '6285a66b88e389',
            pass: '7ca928f8ce090f'
        }
    });


    const message = {
        from: '4397139430-0e7555@inbox.mailtrap.io', // Sender address
        to: '4397139430-0e7555@inbox.mailtrap.io', // List of recipients
        subject: 'Welcome to IDEA!', // Subject line
        //text: 'Have the most fun you can in a car. Get your Tesla today!' // Plain text body
        html: '<h1>Thank you for joining IDEA<h1>'
    };


    transport.sendMail(message, function(err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info);
        }
    });

    res.status(200).send();
})

module.exports = mailRouter;