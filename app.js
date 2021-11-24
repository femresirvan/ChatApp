/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const passport = require('passport');
const cors = require('cors');
const mongoose = require('mongoose')
const ejs = require('ejs')
const http = require('http')
const passportSocketIo = require('passport.socketio')
const Gaming = require('./models/Gaming');
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({
    path: '.env'
});

/**
 * Create Express server.
 */
const app = express();
app.use(cors())
/**
 * Connect to MongoDB.
 */
require('./config/database_connection')

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('layouts', path.join(__dirname, 'views/layouts'));
app.set('/uploads', express.static(path.join(__dirname, 'uploads')));
app.set('view engine', 'ejs');
app.use(compression());

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/bootstrap', express.static(path.join(__dirname, '/node_modules/bootstrap/dist')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(session({
    key: 'express.sid',
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 1209600000
    }, // two weeks in milliseconds
    store: new MongoStore({
        url: process.env.MONGODB_URI,
        mongooseConnection: mongoose.connection,
        autoReconnect: true,
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// app.use((req, res, next) => {
//     if (req.path === '/api/upload') {
//         // Multer multipart/form-data handling needs to occur before the Lusca CSRF check.
//         next();
//     } else {
//         lusca.csrf()(req, res, next);
//     }
// });
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.disable('x-powered-by');
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use((req, res, next) => {
    // After successful login, redirect back to the intended page
    if (!req.user &&
        req.path !== '/login' &&
        req.path !== '/signup' &&
        !req.path.match(/^\/auth/) &&
        !req.path.match(/\./)) {
        req.session.returnTo = req.originalUrl;
    } else if (req.user &&
        (req.path === '/account' || req.path.match(/^\/api/))) {
        req.session.returnTo = req.originalUrl;
    }
    next();
});
app.use('/', express.static(path.join(__dirname, 'public'), {
    maxAge: 31557600000
}));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/chart.js/dist'), {
    maxAge: 31557600000
}));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd'), {
    maxAge: 31557600000
}));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'), {
    maxAge: 31557600000
}));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/jquery/dist'), {
    maxAge: 31557600000
}));
app.use('/webfonts', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts'), {
    maxAge: 31557600000
}));

/**
 * Connect to router.
 */
const router = require('./routers/router')
app.use('/', router);

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
    app.use((err, req, res, next) => {
        // console.log(req);
        res.status(err.status || 500).json({
            msg: err.msg || 'Beklenmedik bir hatayla karşılaşıldı.',
            success: false,
            status: err.status || 500
        });
    });
} else {
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).send('Server Error');
    });
}

/**
 * Start Express server.
 */
var server = http.createServer(app)
global.io = require('socket.io')().listen(server); // it can bu vulnerable. i made it global to reach any other js file without commonjs export expressions.

// const io = require('./config/socketio').init(server);

io.use(passportSocketIo.authorize({
    cookieParser: require('cookie-parser'), //optional your cookie-parser middleware function. Defaults to require('cookie-parser')
    key: 'express.sid', //make sure is the same as in your session settings in app.js
    secret: process.env.SESSION_SECRET, //make sure is the same as in your session settings in app.js
    store: new MongoStore({
        url: process.env.MONGODB_URI,
        mongooseConnection: mongoose.connection,
        autoReconnect: true,
    }) //you need to use the same sessionStore you defined in the app.use(session({... in app.js
    // success:      onAuthorizeSuccess,  // *optional* callback on success
    // fail:         onAuthorizeFail,     // *optional* callback on fail/error
}));
io.of('/gaming').use(passportSocketIo.authorize({
    cookieParser: require('cookie-parser'), //optional your cookie-parser middleware function. Defaults to require('cookie-parser')
    key: 'express.sid', //make sure is the same as in your session settings in app.js
    secret: process.env.SESSION_SECRET, //make sure is the same as in your session settings in app.js
    store: new MongoStore({
        url: process.env.MONGODB_URI,
        mongooseConnection: mongoose.connection,
        autoReconnect: true,
    }) //you need to use the same sessionStore you defined in the app.use(session({... in app.js
    // success:      onAuthorizeSuccess,  // *optional* callback on success
    // fail:         onAuthorizeFail,     // *optional* callback on fail/error
}));
io.of('/gaming').on('connection', async (socket) => {
    try {
        console.log(chalk.yellow(chalk.green('✓'), 'A user connected from gaming namespace'));
        
        const ids = await Gaming.aggregate([{
            $lookup: {
                from: "users", // collection name in db
                localField: "_id",
                foreignField: "_id",
                as: "user"
        }}])
        socket.broadcast.emit('gaming-user-connect',socket.request.user.profile);
        socket.emit('gaming-users-connect',ids);
        // const gamingUser = new Gaming({
        //     _id: socket.request.user._id
        // });
        const yeniKayit = new Gaming({
            _id: socket.request.user._id
        })
        const result = await Gaming.findById(socket.request.user._id);
        if (result) {
            // let query = {
            //     /* query */ };
            // let update = {
            //     _id: socket.request.user._id
            // };
            // let options = {
            //     upsert: true,
            //     new: true,
            //     setDefaultsOnInsert: true
            // };
            // let model = await Gaming.findOneAndUpdate(query, update, options);
            // if (!model) console.error('Model does not find.');
        }
        if (!result) {
            const model = await yeniKayit.save();
        }

    } catch (err) {
        console.error(err);
    }
    socket.on('gaming', (msg) => { //biri mesaj attı
        const date = new Date();
        let timeStr;
        if (date.getHours().toString().length == 1 || date.getMinutes().toString().length == 1) {
            if (date.getHours().toString().length == 1 && date.getMinutes().toString().length == 2) timeStr = '0' + date.getHours() + ':' + date.getMinutes();
            else if (date.getHours().toString().length == 2 && date.getMinutes().toString().length == 1) timeStr = date.getHours() + ':' + '0' + date.getMinutes();
            else if (date.getHours().toString().length == 1 && date.getMinutes().toString().length == 1) timeStr = '0' + date.getHours() + ':' + '0' + date.getMinutes();
        } else timeStr = date.getHours() + ':' + date.getMinutes();
        socket.broadcast.emit('gaming', {
            msg: msg,
            time: timeStr,
            user: socket.request.user.profile
        }) //atılan mesajı açık kanallara emit(yayılma) ettik
        // socket.broadcast.emit('gaming-message', msg) //atılan mesajı açık kanallara emit(yayılma) ettik
        console.log(msg + " gönderildi");
    })
    socket.on("disconnect", async (reason) => {
        socket.broadcast.emit('gaming-user-disconnect',socket.request.user.profile);
        try {
            console.log(socket.request.user._id);
            const deletion = await Gaming.findByIdAndRemove(socket.request.user._id);
            if (!deletion) console.log('mongoose error');
        } catch (err) {
            console.error(err);
        }
        console.log(chalk.yellow(chalk.green('✓'), 'A user disconnect'));
    });

})
io.on('connection', (socket) => {
    console.log(chalk.yellow(chalk.green('✓'), 'A user connected global io'));
})

server.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
    console.log(chalk.magentaBright('  Press CTRL-C to stop'));
});

const getIO = (req, res, next) => {
    if (!io) {
        throw new Error("socket is not initialized");
    }
    return io;
}
// module.exports = getIO;