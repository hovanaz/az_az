const Google = require('./src/google');
const Facebook = require('./src/facebook');
const { getUserNameFromEmail } = require('./src/helper');

module.exports = {
    Google,
    Facebook,
    getUserNameFromEmail
};
