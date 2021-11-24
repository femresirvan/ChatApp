exports.index = (req, res) => {
    if (!req.user) {
        return res.redirect('/signin');
    } else {
        res.render('channels', {
            title: 'Channels ChatAPP'
        });
    }
};