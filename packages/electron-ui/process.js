const { ipcMain } = require('electron');
const exec = require('child_process').exec;
const Amazon = require('@arp/amazon-action');
const { sleep } = require('@arp/captcha/src/helper');
const GoogleSheet = require('@arp/google-sheet');

const fs = require('fs');

let forceStop = false;

/*
* Run actions
 */
const doAction = (account, configs, event) => {
    const [email, password, answer, answer_2, answer_3] = account.split('|');
    const accountInfo = {
        email,
        password
    };

    return new Promise(async (resolove, reject) => {
        const amazon = new Amazon({
            email,
            password,
            answer,
            answer_2,
            answer_3
        }, {
            headless: configs.hardlessMode,
            guessName: configs.guessName,
            googleApis: configs.googleApis
        });

        try {
            event.reply('status', {
                status: 'doing',
                account: accountInfo
            });

            const sendLog = (log = '') => {
                event.reply('log', {
                    account: accountInfo,
                    log
                });
            };

            await amazon.initalBrowser();
            sendLog('Create browser');

            await amazon.goToRecoveryPage();
            sendLog('Go To Recovery Page');

            await amazon.fillRecoveryMail();
            sendLog('Enter email');

            await sleep(3000);

            let pageType;
            let forceQuit = false;
            let maxTimeSolveCaptcha = 50;
            let maxTimeFillOTP = 5;

            let answerTime = 0;
            const answerForTime = [answer, answer_2, answer_3];

            do {
                pageType = await amazon.detectPage();
                // pageType = amazon.PAGE_TYPES.QUESTION;

                switch (pageType) {
                    case amazon.PAGE_TYPES.OTP:
                        sendLog(`Fill OTP (${maxTimeFillOTP})`);

                        if (maxTimeFillOTP-- <= 0) {
                            event.reply('status', {
                                status: 'error',
                                account: accountInfo,
                                message: 'Fill Captcha Too much!'
                            });
                            forceQuit = true;
                            reject('Wrong captcha too much');
                        }

                        await amazon.fillRecoveryOTP().catch(() => {
                            event.reply('status', {
                                status: 'error',
                                account: accountInfo,
                                message: 'Can\'t not get OTP'
                            });
                            forceQuit = true;
                            reject('Get trouble with mail server');
                        });

                        break;
                    case amazon.PAGE_TYPES.CAPTCHA:
                        sendLog(`Solve Captcha (${maxTimeSolveCaptcha})`);
                        if (maxTimeSolveCaptcha-- <= 0) {
                            event.reply('status', {
                                status: 'error',
                                account: accountInfo,
                                message: 'Solve captcha too much !'
                            });
                            forceQuit = true;
                            reject('Wrong captcha too  much !');
                        }

                        await amazon.solveCaptcha().catch(() => {
                            event.reply('status', {
                                status: 'error',
                                account: accountInfo,
                                message: 'Can\'t not solve captcha'
                            });
                            forceQuit = true;
                            reject('Server AnyCaptcha get trouble or network error !');
                        });

                        break;
                    case amazon.PAGE_TYPES.FUN_CAPTCHA:
                        sendLog(`Solve Fun Captcha (${maxTimeSolveCaptcha})`);
                        if (maxTimeSolveCaptcha-- <= 0) {
                            event.reply('status', {
                                status: 'error',
                                account: accountInfo,
                                message: 'Solve captcha too much !'
                            });
                            forceQuit = true;
                            reject('Solve captcha too much!');
                        }

                        await amazon.solveFunCaptcha({
                            sleep: 3000,
                            repeat: 10
                        }).catch(() => {
                            event.reply('status', {
                                status: 'error',
                                account: accountInfo,
                                message: 'Can\'t not solve captcha'
                            });
                            forceQuit = true;
                            reject('Server AnyCaptcha (Fun Captcha) get trouble or network error !');
                        });
                        break;
                    case amazon.PAGE_TYPES.QUESTION:
                        sendLog('Answer Question');
                        const answer = answerForTime[answerTime];
                        answerTime++;

                        if (answer) {
                            await amazon.answerQuestion(answer).catch(() => {
                                event.reply('status', {
                                    status: 'error',
                                    account: accountInfo,
                                    message: 'Wrong answer !'
                                });
                                forceQuit = true;
                                reject('Step answear question get trouble');
                            });
                        } else {
                            await amazon.answerQuestion().catch(() => {
                                event.reply('status', {
                                    status: 'error',
                                    account: accountInfo,
                                    message: 'Wrong answer !'
                                });
                                forceQuit = true;
                                reject('Step answear question get trouble');
                            });
                        }
                        break;
                    case amazon.PAGE_TYPES.NEW_PASSWORD:
                        sendLog('Enter New Password');
                        await amazon.enterNewPassword();
                        break;
                    case amazon.PAGE_TYPES.ENTER_PHONE:
                        sendLog('Skip Enter Phone');
                        await amazon.skipEnterPhone();
                        await sleep(5000);
                        break;

                    case amazon.PAGE_TYPES.HOMEPAGE:
                        sendLog('Inject Script');
                        const result = await amazon.injectGetOrderScript();

                        if (result) {

                            if (result.includes('No Address')) {
                                event.reply('status', {
                                    status: 'error',
                                    account: accountInfo,
                                    message: 'No Address'
                                });
                            } else {
                                event.reply('status', {
                                    status: 'done',
                                    account: accountInfo,
                                    result
                                });
                            }

                        } else {
                            event.reply('status', {
                                status: 'error',
                                account: accountInfo,
                                message: 'Inject fail'
                            });
                        }
                        await amazon.browser.close();
                        await amazon.quitBrowser();
                        forceQuit = true;
                        resolove(result);
                        break;
                    case amazon.PAGE_TYPES.ERROR:

                        event.reply('status', {
                            status: 'error',
                            account: accountInfo,
                            message: 'Unknown Error'
                        });

                        await amazon.browser.close();
                        await amazon.quitBrowser();
                        reject('Spam page');
                        forceQuit = true;
                        break;
                    case amazon.PAGE_TYPES.SPAM:
                        event.reply('status', {
                            status: 'error',
                            account: accountInfo,
                            message: 'Spam - Need Change IP'
                        });
                        await amazon.browser.close();
                        await amazon.quitBrowser();
                        reject('Spam page');
                        forceQuit = true;
                        break;
                    case amazon.PAGE_TYPES.WRONG_EMAIL:
                        event.reply('status', {
                            status: 'error',
                            account: accountInfo,
                            message: 'Wrong Email'
                        });
                        await amazon.browser.close();
                        await amazon.quitBrowser();
                        reject('Wrong Email');
                        forceQuit = true;
                        break;
                    case amazon.PAGE_TYPES.TRY_TO_MUCH:
                        event.reply('status', {
                            status: 'error',
                            account: accountInfo,
                            message: 'Try to much'
                        });
                        await amazon.browser.close();
                        await amazon.quitBrowser();
                        reject('Try To Much');
                        forceQuit = true;
                        break;
                    case amazon.PAGE_TYPES.REQUIRE_ZIP_CODE:
                        event.reply('status', {
                            status: 'error',
                            account: accountInfo,
                            message: 'Require Zip Code'
                        });
                        await amazon.browser.close();
                        await amazon.quitBrowser();
                        reject('Require Zip Code');
                        forceQuit = true;
                        break;
                    case amazon.PAGE_TYPES.ACCOUNT_LOCKED:
                        event.reply('status', {
                            status: 'error',
                            account: accountInfo,
                            message: 'Account Locked'
                        });
                        await amazon.browser.close();
                        await amazon.quitBrowser();
                        reject('Account Locked');
                        forceQuit = true;
                        break;
                    case amazon.PAGE_TYPES.PHONE_QUESTION:
                        event.reply('status', {
                            status: 'error',
                            account: accountInfo,
                            message: 'Phone Question'
                        });
                        await amazon.browser.close();
                        await amazon.quitBrowser();
                        reject('Phone Question');
                        forceQuit = true;
                        break;
                    default:
                        sendLog('Quit Browser');

                        event.reply('status', {
                            status: 'error',
                            account: accountInfo,
                            message: 'Spam ND'
                        });
                        await amazon.browser.close();
                        await amazon.quitBrowser();
                        forceQuit = true;
                        reject('Spam ND');

                }
            } while (pageType !== amazon.PAGE_TYPES.ERROR && !forceQuit && !forceStop);

            await amazon.browser.close();
            await amazon.quitBrowser();
            resolove(true);
        } catch (e) {
            event.reply('status', {
                status: 'error',
                account: accountInfo,
                message: e.message
            });
            await amazon.browser.close();
            await amazon.quitBrowser();
            reject(e.message);
        }
    });
};

/*
* Using for change IP
 */
ipcMain.on('changeIP', (event, args) => {
    const command = args.command || '';
    if (command !== '') {
        exec(command, (error, stdout) => {
            if (error) {
                return event.returnValue = {
                    status: false,
                    message: error.message
                };
            }
            return event.returnValue = {
                status: true,
                message: stdout
            };
        });
    } else {
        return event.returnValue = {
            status: false,
            message: 'Command null'
        };
    }
});

/*
* Handle event run account from client.
 */
ipcMain.on('runAccount', (event, args) => {
    const { account, configs } = args;
    const runTimeout = setTimeout(() => {
        event.reply('runAccount', {
            account,
            success: false,
            message: 'Timeout'
        });
    }, 5 * 60 * 1000);

    doAction(account, configs, event).then((value) => {
        event.reply('runAccount', {
            account,
            success: true,
            value,
            message: 'SUCCESS'
        });
    }).catch(err => {
        event.reply('runAccount', {
            account,
            success: false,
            message: err.message
        });
    }).finally(() => {
        clearTimeout(runTimeout);
    });
});

/*
* Google Sheet tests
 */
ipcMain.on('addToSheet', (event, args) => {
    const {
        sheetId,
        sheetTitle = 'Success',
        row
    } = args;

    const sheet = new GoogleSheet(sheetId);
    sheet.addRow(sheetTitle, row).then((res) => {
        event.returnValue = {
            success: true,
            data: res,
            message: 'SUCCESS'
        };
    }).catch(err => {
        event.returnValue = {
            success: false,
            message: err.message
        };
    });
});

/*
* Save setting
 */
ipcMain.on('saveSetting', (event, args) => {
    const { configs } = args;
    fs.writeFile('./setting.json', JSON.stringify(configs), (err, result) => {
        if (err) {
            return event.returnValue = false;
        }
        return event.returnValue = true;
    });
});

/*
* Return settings
 */

ipcMain.on('loadSettings', (event) => {
    const settings = fs.readFileSync('./setting.json', {
        encoding: 'utf-8'
    });
    event.returnValue = JSON.parse(settings);
});
const processMessage = () => {
    console.log('Handle Process');
};

module.exports = {
    processMessage
};
