/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
    res.render('signIn', {
        title: 'SignIn'
    });
};