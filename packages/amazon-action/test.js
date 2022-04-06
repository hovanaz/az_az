const Amazon = require('./index');
// async function init() {
//     const accountList = fs.readFileSync('__tests/accounts.txt', 'utf-8');
//
//     const accounts = accountList.split('\n');
//
//     for (const account of accounts) {
//         const [email, password] = account.split('|');
//         await checkAccount({
//             email,
//             password
//         });
//     }
// // test();
// }

// init();

async function checkAccount(account) {

    const amazon = new Amazon(
        account, {
            headless: false
        });

    await amazon.initalBrowser();
    amazon.page.goto('https://bot.sannysoft.com/');

}

checkAccount({
    email: 'asdad',
    password: 'asdad'
});
