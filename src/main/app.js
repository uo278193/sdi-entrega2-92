let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let app = express();

let rest = require('request');
app.set('rest', rest);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    // Debemos especificar todas las headers que se aceptan. Content-Type , token
    next();
});


let jwt = require('jsonwebtoken');
app.set('jwt', jwt);

let expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

let crypto = require('crypto');

let fileUpload = require('express-fileupload');
app.use(fileUpload(
    {
        limits: {fileSize: 50 * 1024 * 1024},
        createParentPath: true
    }));

app.set('uploadPath', __dirname)
app.set('clave', 'abcdefg');
app.set('crypto', crypto);

let bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const {MongoClient} = require("mongodb");
const url = "mongodb+srv://admin:admin@sdi-entrega2-92.qguw0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

app.set('connectionStrings', url);

// Antes de los controladores de /users y /songs
const userSessionRouter = require('./routes/userSessionRouter');
const userAuthorRouter = require('./routes/userAuthorRouter');
app.use("/messages/edit", userAuthorRouter);
app.use("/messages/delete", userAuthorRouter);

const userTokenRouter = require('./routes/userTokenRouter'); // habrá que cambiarlo
app.use("/api/v1.0/sdigram/", userTokenRouter);

const userAudiosRouter = require('./routes/userAudiosRouter');

app.use("/messages/add", userSessionRouter);
app.use("/publications", userSessionRouter);
app.use("/audios/", userAudiosRouter);
app.use("/feed/", userSessionRouter)

let commentsRepository = require("./repositories/messagesRepository.js");
commentsRepository.init(app, MongoClient);
let messagesRepository = require("./repositories/messagesRepository.js"); // los repositorios deben estar definidos ANTES que los controladores
messagesRepository.init(app, MongoClient);
const usersRepository = require("./repositories/usersRepository.js");
usersRepository.init(app, MongoClient);

let indexRouter = require('./routes/index');
require("./routes/users.js")(app, usersRepository);
require("./routes/comments.js")(app, commentsRepository);
require("./routes/authors.js")(app);

require("./routes/api/messagesAPIv1.0.js")(app, usersRepository, messagesRepository);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    console.log("Se ha producido un error " + err);
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
