const axios = require('axios');
const cheerio = require('cheerio');
const { getUserNameFromEmail } = require('./helper');

const toTitleCase = (word = '') => {
    return word.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
};

const compareName = (_searchName = '', _suggestionName = '') => {
    const searchName = _searchName.toLowerCase();

    // Remove Trash Name
    const suggestionNameWords = _suggestionName.toLowerCase().split(' ');
    const formattedSuggestionName = suggestionNameWords.reduce((result, word) => {
        if (searchName.includes(word)) {
            result.push(word);
        }
        return result;
    }, []).join(' ');

    const percentPerMathChar = (100 / searchName.length);
    const suggestionNameChars = formattedSuggestionName.replace(/ /g, '').split('');

    let matchPercent = 0;

    for (let i = 0; i < suggestionNameChars.length; i++) {
        const word = suggestionNameChars[i];
        const nextWord = suggestionNameChars[i + 1] || '';
        const prevWord = suggestionNameChars[i - 1] || '';

        if (searchName.includes(word + nextWord) || searchName.includes(prevWord + word)) {
            matchPercent += percentPerMathChar;
        }
    }

    // Increase match percent if same length;
    if (searchName.length === suggestionNameChars.length) {
        matchPercent += 0.2;
    }

    return {
        suggestion: toTitleCase(formattedSuggestionName),
        matchPercent
    };
};

class Facebook {

    constructor(cookie = 'locale=en_GB;') {
        this.COOKIE = cookie;
    }

    async crawlFromFacebook(username = '') {
        const url = 'https://m.facebook.com/public/' + username;

        const responsive = await axios.get(url, {
            headers: {
                Cookie: this.COOKIE
            }
        }).then(res => res.data).catch(() => '<p></p>');

        const $ = cheerio.load(responsive);

        let matchedName = null;

        const nameElements = $('table tr');
        nameElements.map((index, value) => {
            const name = $(value).find('td a div div').text().trim();

            if (name !== '') {
                const { matchPercent, suggestion } = compareName(username, name);

                if (matchPercent >= 100) {
                    matchedName = suggestion;
                }
            }
        });

        return matchedName;
    };

    getNameFromEmail = (email = '') => {
        const username = getUserNameFromEmail(email);
        return this.crawlFromFacebook(username);
    };

}

module.exports = Facebook;
