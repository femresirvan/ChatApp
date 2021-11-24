exports.index = (req, res) => {
    if (!req.user) {
        return res.redirect('/signin');
    } else {
        res.render('movie', {
            title: 'Movie ChatApp'
        });
    }
};