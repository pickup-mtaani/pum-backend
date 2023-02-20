var path = require('path');
const Email = require('email-templates');
const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars');

const handlebarOptions = {
    viewEngine: {
        extName: '.handlebars',
        partialsDir: path.join(__dirname, './../Templates/partials/'),
        layoutsDir: path.join(__dirname, './../Templates/'),
        defaultLayout: 'main.handlebars',
    },
    viewPath: path.join(__dirname, './../Templates/'),
    extName: '.handlebars',
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bradcoupers@gmail.com',
        pass: 'arezhtosrwqwylyv' // naturally, replace both with your real credentials or an application-specific password
    }
});

transporter.use('compile', hbs(handlebarOptions));

module.exports = transporter