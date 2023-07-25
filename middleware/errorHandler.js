const constants = require('../constants');
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    switch (statusCode) {
        case constants.VALIDATION_FAILED:
            res.json({title: "Validation Error!",message: err.message })

        case constants.NOT_FOUND:
            res.json({title: "Not found!",message: err.message });

        case constants.UNAUTHORISED:
            res.json({title: "Unauthorised request!",message: err.message });

        case constants.FORBIDDEN:
            res.json({title: "Forbidden request!",message: err.message });

        case constants.SERVERERROR:
            res.json({title: "Forbidden request!",message: err.message });
        default:
            console.log('RedRingFires is live yet!')
    }

}

module.exports = errorHandler;