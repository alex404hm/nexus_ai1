const User = require('../models/User');

exports.verifyToken = async (req, res, next) => {
    const { token } = req.params;

    if (!token) return res.status(404).send('Page Not Found');

    try {
        const user = await User.findOne({ verificationToken: token });
        if (!user) return res.status(404).send('Page Not Found');

        req.user = user;
        next();
    } catch (error) {
        console.error('Verification error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};
