exports.index = (req, res) => {
    if (!req.user) {
        return res.redirect('/signUp');
    } else {
        res.render('profile', {
            title: 'Profile'
        });
    }
};