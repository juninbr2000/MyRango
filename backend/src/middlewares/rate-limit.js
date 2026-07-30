const rateLimit = require("express-rate-limit");

exports.loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 15,

    message:{
        error: 'Muitas requisições, tente novamente mais tarde'
    }
});

exports.registerLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 3, 

    message:{
        error: 'Muitas requisições, tente novamente mais tarde'
    }
})