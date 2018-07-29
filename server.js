const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const under_maintenance = false;

const server_port = 3000;
const log_file = 'server.log';

let app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
// app.use(express.static(__dirname + '/public'));

app.use((request, response, next) => {
    let now = new Date().toString();
    let log = `${now}: ${request.method} ${request.url} FROM ${request.ip}`;

    console.log(log);
    fs.appendFile(log_file, log + '\n', (err) => {
        if(err) {
            console.log(`Unable to append to ${log_file}.`);
        }
    });
    next();
});

if(under_maintenance){
    app.use((request, response, next) => {
        response.render('maintenance.hbs', {
            pageTitle: 'Down for Maintenance'
        });
    });
}


app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
})

app.get('/', (request, response) =>{
    response.render('home.hbs', {
        pageTitle: 'Home',
        welcomeMessage: 'Hello and welcome to this website!'
    });
});

app.get('/about', (request, response) =>{
    response.render('about.hbs',{
        pageTitle: 'About Page',
    });
});

app.get('/bad', (request, response) =>{
    response.send({
        errorMessage: 'Bad request'
    });
})

app.listen(server_port, () =>{
    console.log(`Server is listening on port ${server_port}`)
});