exports.getUserNameFromEmail = (email = '') => {
    const regex = /([0-9])|(\.|\_)|(\@\w*\.\w*)/g;
    return email.replace(regex, '');
};
