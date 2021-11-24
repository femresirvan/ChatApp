const express = require('express');
const router = express.Router();
const lusca = require('lusca')
const multer = require('multer')
const path = require('path')

const passport = require('passport');
const channelController = require('../controllers/channel')
const musicController = require('../controllers/music')
const gamingController = require('../controllers/gaming')
const movieController = require('../controllers/movie')
const homeController = require('../controllers/home');
const userController = require('../controllers/user');
const apiController = require('../controllers/api');
//const contactController = require('../controllers/contact');
const signinController = require('../controllers/sign_in');
const signupController = require('../controllers/sign_up');

//MULTER CONFIG
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
  })
   
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Filetype is not correct.'), false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024
    },
    fileFilter: fileFilter
  });


/**
 * API keys and Passport configuration.
 */
const passportConfig = require('../config/passport');
const { next } = require('cheerio/lib/api/traversing');

/**
 * Primary router routes.
 */
router.get('/', homeController.index);

router.get('/channels', passportConfig.isAuthenticated, channelController.index); //passportisAuthenticated eklenecek
router.get('/music', passportConfig.isAuthenticated, musicController.index); //passportisAuthenticated eklenecek
router.get('/gaming', passportConfig.isAuthenticated, gamingController.index); //passportisAuthenticated eklenecek
router.get('/movie', passportConfig.isAuthenticated, movieController.index); //passportisAuthenticated eklenecek
//router.get('/signIn', signinController.index, );
//router.get('/signUp', signupController.index);
router.get('/signin', userController.getSignin);
router.post('/signIn', userController.postSignin);
router.get('/signup', userController.getSignup);
router.post('/signUp', upload.single('resim'), userController.postSignup);
router.get('/logout', passportConfig.isAuthenticated, userController.logout);
router.get('/users', passportConfig.isAuthenticated, userController.getUsers);
router.get('/forgot', userController.getForgot);
router.post('/forgot', userController.postForgot);
router.get('/reset/:token', userController.getReset);
router.post('/reset/:token', userController.postReset);
// router.get('/contact', contactController.getContact);
// router.post('/contact', contactController.postContact);
router.get('/account/verify', passportConfig.isAuthenticated, userController.getVerifyEmail);
router.get('/account/verify/:token', passportConfig.isAuthenticated, userController.getVerifyEmailToken);
router.get('/account/profile', passportConfig.isAuthenticated, userController.getAccount);
//router.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
router.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
router.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
router.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);


// /**
//  * API examples routes.
//  */
router.get('/api/me', passportConfig.isAuthenticated, userController.getProfile);
router.get('/api/users/:namespace',passportConfig.isAuthenticated, apiController.getUsersFromExactNamespace)
// router.get('/api', apiController.getApi);
// router.get('/api/lastfm', apiController.getLastfm);
// router.get('/api/nyt', apiController.getNewYorkTimes);
// router.get('/api/steam', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getSteam);
// router.get('/api/stripe', apiController.getStripe);
// router.post('/api/stripe', apiController.postStripe);
// router.get('/api/scraping', apiController.getScraping);
// router.get('/api/twilio', apiController.getTwilio);
// router.post('/api/twilio', apiController.postTwilio);
// router.get('/api/foursquare', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFoursquare);
// router.get('/api/tumblr', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTumblr);
// router.get('/api/facebook', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);
// router.get('/api/github', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getGithub);
// router.get('/api/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTwitter);
// router.post('/api/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postTwitter);
// router.get('/api/twitch', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTwitch);
// router.get('/api/instagram', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getInstagram);
// router.get('/api/paypal', apiController.getPayPal);
// router.get('/api/paypal/success', apiController.getPayPalSuccess);
// router.get('/api/paypal/cancel', apiController.getPayPalCancel);
// router.get('/api/lob', apiController.getLob);
// router.get('/api/upload', lusca({ csrf: true }), apiController.getFileUpload);
// router.post('/api/upload', upload.single('resim'), apiController.postFileUpload);
// router.get('/api/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getPinterest);
// router.post('/api/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postPinterest);
// router.get('/api/here-maps', apiController.getHereMaps);
// router.get('/api/google-maps', apiController.getGoogleMaps);
// router.get('/api/google/drive', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getGoogleDrive);
// router.get('/api/chart', apiController.getChart);
// router.get('/api/google/sheets', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getGoogleSheets);
// router.get('/api/quickbooks', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getQuickbooks);


/**
 * OAuth authentication routes. (Sign in)
 */

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/channels');
});

module.exports = router;