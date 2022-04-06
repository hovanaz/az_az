const imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const _ = require('lodash');

const config = {
    imap: {
        // user: 'boleydonald@hotmail.com',
        // password: 'V2EbxDybkqn!3yU',
        host: 'imap-mail.outlook.com',
        port: 993,
        tls: true,
        authTimeout: 3000
    }
};

const getRecoveryCode = async (email, password) => {
    try {
        config.imap.user = email;
        config.imap.password = password;

        const connection = await imaps.connect(config);

        await connection.openBox('INBOX');

        const searchCriteria = ['ALL'];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT', ''],
        };

        const messages = await connection.search(searchCriteria, fetchOptions);

        /* 
        * TODO: Improve performance.
        */
        let opt = null;
        for (const item of messages) {
            const all = _.find(item.parts, { "which": "" })
            const id = item.attributes.uid;
            const idHeader = "Imap-Id: " + id + "\r\n";
            const mail = await simpleParser(idHeader + all.body);


            if (mail.subject.includes('Amazon password assistance')) {
                const regex = /<p class="otp">(\d*)<\/p>/g;
                const findedOTP = regex.exec(mail.html);
                if (findedOTP && findedOTP[1]) {
                    opt = findedOTP[1];
                }
            }
        }
        return opt;

    } catch (error) {
        return null;
    }

}

module.exports = {
    getRecoveryCode
}
