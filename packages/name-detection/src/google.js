const axios = require('axios');
const { getUserNameFromEmail } = require('./helper');

const toTitleCase = (word = '') => {
    return word.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
};

class Google {
    API_URL = 'https://www.googleapis.com/customsearch/v1/siterestrict';

    constructor(apiKey = '') {
        this.API_KEY = apiKey;
    }

    async getNameFromEmail(email = '') {
        const username = getUserNameFromEmail(email);

        const result = await axios.get(this.API_URL, {
            params: {
                key: this.API_KEY,
                cx: '017576662512468239146:omuauf_lfve',
                q: username
            }
        }).then(res => res.data).catch(err => {
            console.log(err);
            return {};
        });

        const correctName = (result?.spelling?.correctedQuery) || null;
        if (correctName) {
            return toTitleCase(correctName);
        } else {
            return null;
        }
    };

}

module.exports = Google;

