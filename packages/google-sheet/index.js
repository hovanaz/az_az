const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./key.json');

class GoogleSheet {
    constructor(sheetId = '1G3rwE335PJOr4SWo_gMqSnbhe5eZWBfhyRMT_X42iWE') {
        this.doc = new GoogleSpreadsheet(sheetId);
    }

    async addRow(sheetTitle = 'Error', row = {}) {
        await this.doc.useServiceAccountAuth(creds);
        await this.doc.loadInfo();
        const successSheet = this.doc.sheetsByTitle[sheetTitle];
        return await successSheet.addRow(row);
    }

}

module.exports = GoogleSheet;
