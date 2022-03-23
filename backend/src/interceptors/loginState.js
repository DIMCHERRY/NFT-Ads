// const cryptor = require('../utils/symmetricKey');
const Debug = require('debug');
const debug = Debug('validateLogin');

const NEED_LOGIN_URL = [
    '/test/login',
    '/api/tokens'
];
const isNeedLogin = url => {
    if (NEED_LOGIN_URL.some(p => url.startsWith(p))) {
        return true;
    }
    return false;
}

const validateLogin = async (req, res, next) => {
    const { token } = req.cookies;
    if (!isNeedLogin(req.baseUrl)) {
        return next();
    }
    if (!token) {
        debug('token not exist!')
        res.status(401).json({
            errorCode: 4,
            errorMsg: 'need login',
            data: {}
        });
        return;
    }
    const isValidToken = () => {
        try {
            const tokenJson = JSON.parse(token);
            return tokenJson.expires > new Date().getTime()
        } catch(err) {
            debug('isValidToken error:', err);
            return false;
        }
    }
    if (!isValidToken()) {
        res.status(401).json({
            errorCode: 4,
            errorMsg: 'invalid login token',
            data: {}
        });
        return;
    }
    return next();
};

module.exports = validateLogin;