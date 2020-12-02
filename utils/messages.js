const moment  = require('moment');

exports.formatMessage = (userName, text) => {
    return {
        userName,
        text,
        time: moment().format('hh:mm a')
    };
}