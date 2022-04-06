const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const request = require('request-promise'); 
const path = require('path');

const fs = require('fs');
const outlockOtp = require('@arp/outlook-opt');
const { anyCaptcha, twoCaptcha } = require('@arp/captcha');
const { Google, Facebook, getUserNameFromEmail } = require('@arp/name-detection');

const sleep = require('./helper/sleep');
const userAgent = require('user-agents');

// AZcaptcha
const APIkey = "n4kpjjhftgvddrygq38fz9mh2rwnx6cp"
const APIin = "http://azcaptcha.com/in.php"
const APIres = "https://azcaptcha.com/res.php"



class Amazon {
    RECOVERY_URL = 'https://www.amazon.com/ap/forgotpassword?showRememberMe=true&openid.pape.max_auth_age=0&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&pageId=usflex&openid.return_to=https%3A%2F%2Fwww.amazon.com%2F%3Fref_%3Dnav_custrec_signin&prevRID=WQ2DCE5BGV4EHQPB2T1Y&openid.assoc_handle=usflex&openid.mode=checkid_setup&prepopulatedLoginId=&failedSignInCount=0&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0';

    PAGE_TYPES = {
        OTP: 'OTP',
        CAPTCHA: 'CAPTCHA',
        QUESTION: 'QUESTION',
        NEW_PASSWORD: 'NEW_PASSWORD',
        ENTER_PHONE: 'ENTER_PHONE',
        HOMEPAGE: 'HOMEPAGE',
        ERROR: 'ERROR',
        SPAM: 'SPAM',
        WRONG_EMAIL: 'WRONG_EMAIL',
        ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
        FUN_CAPTCHA: 'FUN_CAPTCHA',
        TRY_TO_MUCH: 'TRY_TO_MUCH',
        REQUIRE_ZIP_CODE: 'REQUIRE_ZIP_CODE',
        PHONE_QUESTION: 'PHONE_QUESTION',
        UNKNOWN: 'UNKNOWN'
    };

    constructor(account, config = {}) {

        const webRTCExtensions = path.resolve(__dirname, './extensions/webrtc_extensions') + ',' +
            path.resolve(__dirname, './extensions/AnyCaptchaCallbackHooker');

        if (config.guessName) {
            this.GUESS_NAME = config.guessName;
            delete config.guessName;
        }

        if (config.googleApis) {
            this.GOOGLE_APIS = config.googleApis.split('\n');
            delete config.googleApis;
        }

        this.config = {
            ...config,
            args: [
                `--disable-extensions-except=${webRTCExtensions}`,
                `--load-extension=${webRTCExtensions}`,
                '--disable-gpu',
                '--no-sandbox',
                '--no-zygote',
                '--disable-setuid-sandbox',
                '--disable-accelerated-2d-canvas',
                '--disable-dev-shm-usage'
                // '--proxy-server=socks5://159.223.79.176:5000'
            ]
        };
        this.email = account.email;
        this.password = account.password;
        this.answer = account.answer;
        this.answer_2 = account.answer_2;
        this.answer_3 = account.answer_3;
    }

    async initalBrowser() {
        this.browser = await puppeteer.launch(this.config);
        this.page = await this.browser.newPage();
        await this.page.setUserAgent(userAgent.toString());
    }

    async goToRecoveryPage() {
        await this.page.goto(this.RECOVERY_URL, { waitUntil: 'networkidle2', timeout: 120000 });
    }

    async waitPageLoaded() {
        await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
    }

    async detectPage() {
        try {
            let unknownTime = 0;
            while (true) {
                try {
                    const isEmail = (await this.page.$('input[name="email"]')) || false;
                    const isCaptcha = (await this.page.$('input[name="cvf_captcha_input"]')) || false;
                    const isQuestion = (await this.page.$('input[name="question_dcq_question_subjective_1"]')) || false;
                    const isOtp = (await this.page.$('input[name="code"]')) || false;
                    const isNewPassword = (await this.page.$('input[name="password"]')) || false;
                    const isEnterPhone = (await this.page.$('input[name="cvf_phone_num"]')) || false;
                    const isHomePage = (await this.page.$('a[data-nav-ref="nav_youraccount_btn"]')) || false;
                    const isFunCaptcha = (await this.page.$('iframe[id="cvf-arkose-frame"]')) || false;
                    const isErrorPage = (await this.page.$('h4[class="a-alert-heading"]')) || false;

                    const pageText = await this.page.evaluate(
                        `document.querySelector("body").innerText`);

                    if (pageText.includes('There was an error with your E-Mail/Password')) {
                        return this.PAGE_TYPES.SPAM;
                    }
                    if (pageText.includes(
                        'We\'re sorry. We weren\'t able to identify you given the information provided.')) {
                        return this.PAGE_TYPES.WRONG_EMAIL;
                    }
                    if (pageText.includes('Account locked')) {
                        return this.PAGE_TYPES.ACCOUNT_LOCKED;
                    }

                    if (pageText.includes('Sorry, you’ve made too many failed attempts')) {
                        return this.PAGE_TYPES.TRY_TO_MUCH;
                    }

                    if (pageText.includes('To help us identify your account, please enter a ZIP code')) {
                        return this.PAGE_TYPES.REQUIRE_ZIP_CODE;
                    }

                    if (pageText.includes('What is the phone number that ends in')) {
                        return this.PAGE_TYPES.PHONE_QUESTION;
                    }

                    if (isCaptcha) return this.PAGE_TYPES.CAPTCHA;
                    if (isOtp) return this.PAGE_TYPES.OTP;
                    if (isQuestion) return this.PAGE_TYPES.QUESTION;
                    if (isNewPassword) return this.PAGE_TYPES.NEW_PASSWORD;
                    if (isEnterPhone) return this.PAGE_TYPES.ENTER_PHONE;
                    if (isHomePage) return this.PAGE_TYPES.HOMEPAGE;
                    if (isFunCaptcha) return this.PAGE_TYPES.FUN_CAPTCHA;
                    if (isErrorPage) return this.PAGE_TYPES.ERROR;

                    if (unknownTime <= 10) {
                        unknownTime++;
                        await sleep(1000);
                    } else {
                        return this.PAGE_TYPES.UNKNOWN;
                    }
                } catch (e) {
                    await sleep(1000);
                }
            }

            // return this.PAGE_TYPES.UNKNOWN;
        } catch (error) {
            console.log(error);
            return this.PAGE_TYPES.ERROR;
        }
    }

    async fillRecoveryMail() {
        await this.page.waitForSelector('input[name=email]');
        await this.page.type('input[name=email]', this.email);
        await this.page.keyboard.press('Enter');
    }

    async solveCaptcha() {
        const captchaImage = await this.page.evaluate(
            `document.querySelector("img[alt='captcha']").getAttribute("src")`);
        const solvedCaptcha = await anyCaptcha.solveCaptcha({
            type: 'ImageToTextTask',
            body: captchaImage,
            subType: 'AMAZON'
        });

        if (solvedCaptcha && solvedCaptcha.text) {
            await this.page.type('input[name=cvf_captcha_input]', solvedCaptcha.text);
            await this.page.keyboard.press('Enter');
        } else {
            throw new Error('Solve captcha error ');
        }
    }

    async solveFunCaptcha() {
        await sleep(5000);
        for (const frame of this.page.mainFrame().childFrames()) {
            if (frame.url().includes('iframe-auth.arkoselabs.com')) {
                const regex = /iframe-auth\.arkoselabs\.com\/(.*)\/index.html/;
                const websiteKey = regex.exec(frame.url())[1];
                let token = "CAPCHA_NOT_READY"
                let IDRequest
                // const solvedCaptcha = await anyCaptcha.solveCaptcha({
                //     type: 'FunCaptchaTaskProxyless',
                //     websitePublicKey: websiteKey
                // });

              await request(`${APIin}?key=${APIkey}&method=funcaptcha&publickey=2F1CD804-FE45-F12B-9723-240962EBA6F8&surl=https://www.amazon.com/&pageurl=https://www.amazon.com/`, async (err, res, _html) => {
                }).then(async function(data){
                    IDRequest = data.split('|')[1]
                      console.log(IDRequest)
                }).catch(function(error) {
                              // One of the two operations above failed
            });
           
            await sleep(1000);
while(token == "CAPCHA_NOT_READY"){
    await sleep(1000);
    await request(`${APIres}?key=${APIkey}&action=get&id=${IDRequest}`, async (err, res, _html) => {
    }).then(function(datas){
          token = datas
          console.log(token)
    }).catch(function(errors) {
        
    });
}


    token = token.replace('OK|','');
                if (token) {
                    console.log(token)
                    // const solvedCaptcha = await twoCaptcha.solveCaptcha({
                    //     publicKey: websiteKey,
                    //     pageUrl: this.page.url()
                    // });
                    // if (solvedCaptcha) {
                    await frame.evaluate(
                        `document.getElementById('anycaptchaSolveButton').onclick('${token}');`);
                }

            }
        }
    }

    async answerQuestion(answer = this.email) {
        await this.page.waitForSelector('input[name=dcq_question_subjective_1]');
        await this.page.type('input[name=dcq_question_subjective_1]', answer);
        await this.page.keyboard.press('Enter');

        //
        // await this.page.waitForNavigation({
        //     waitUntil: 'networkidle0'
        // });

        // let errorMessage = '';
        // try {
        //     errorMessage = await this.page.evaluate(
        //         'document.querySelector("div.cvf-widget-alert-id-cvf-dcq-response-error").textContent');
        // } catch (error) {
        //
        // }

        //
        //
        // if (this.GUESS_NAME && !this.answer) {
        //     const random = Math.floor(Math.random() * this.GOOGLE_APIS.length);
        //
        //     const google = new Google(this.GOOGLE_APIS[random]);
        //
        //     answer = getUserNameFromEmail(this.email);
        //
        //     const nameFromGoogle = await google.getNameFromEmail(this.email);
        //
        //     if (nameFromGoogle) {
        //         answer = nameFromGoogle;
        //     } else {
        //         const facebook = new Facebook();
        //         answer = await facebook.getNameFromEmail(this.email);
        //     }
        // }
        //
        // if (this.answer) {
        //     answer = this.answer;
        // }
        //
        // await this.page.waitForSelector('input[name=dcq_question_subjective_1]');
        // await this.page.type('input[name=dcq_question_subjective_1]', answer);
        // await this.page.keyboard.press('Enter');
        //
        // await this.page.waitForNavigation({
        //     waitUntil: 'networkidle0'
        // });
        //
        // let errorMessage = '';
        // try {
        //     errorMessage = await this.page.evaluate(
        //         'document.querySelector("div.cvf-widget-alert-id-cvf-dcq-response-error").textContent');
        // } catch (error) {
        //
        // }
        //
        // // First
        // if (errorMessage.includes('does not match') && this.GUESS_NAME) {
        //     if (this.GUESS_NAME || this.answer) {
        //         await this.page.waitForSelector('input[name=dcq_question_subjective_1]');
        //         await this.page.type('input[name=dcq_question_subjective_1]', getUserNameFromEmail(this.email));
        //         await this.page.keyboard.press('Enter');
        //
        //         await this.page.waitForNavigation({
        //             waitUntil: 'networkidle0'
        //         });
        //
        //         try {
        //             errorMessage = await this.page.evaluate(
        //                 'document.querySelector("div.cvf-widget-alert-id-cvf-dcq-response-error").textContent');
        //         } catch (error) {
        //
        //         }
        //
        //     }
        // }
        //
        // if (errorMessage.includes('does not match') && this.answer_2) {
        //     await this.page.waitForSelector('input[name=dcq_question_subjective_1]');
        //     await this.page.type('input[name=dcq_question_subjective_1]', this.answer_2);
        //     await this.page.keyboard.press('Enter');
        //
        //     await this.page.waitForNavigation({
        //         waitUntil: 'networkidle0'
        //     });
        //
        //     try {
        //         errorMessage = await this.page.evaluate(
        //             'document.querySelector("div.cvf-widget-alert-id-cvf-dcq-response-error").textContent');
        //     } catch (error) {
        //
        //     }
        //
        // }
        //
        // if (errorMessage.includes('does not match') && this.answer_3) {
        //     await this.page.waitForSelector('input[name=dcq_question_subjective_1]');
        //     await this.page.type('input[name=dcq_question_subjective_1]', this.answer_3);
        //     await this.page.keyboard.press('Enter');
        //
        //     await this.page.waitForNavigation({
        //         waitUntil: 'networkidle0'
        //     });
        // }
        //
        // this.page.reload();
    }

    async enterNewPassword(password = this.password) {
        await this.page.waitForSelector('input[name=password]');
        await this.page.type('input[name=password]', password);
        await this.page.keyboard.press('Tab');
        await this.page.keyboard.sendCharacter(password);
        await this.page.keyboard.press('Enter');
    }

    async skipEnterPhone() {
        await this.page.waitForSelector('a[data-name=skip]');
        await this.page.click('a[data-name=\'skip\']');
    }

    async fillRecoveryOTP(config = {
        delay: 3000,
        repeat: 5
    }) {
        await this.page.waitForSelector('input[name=code]');
        let opt;
        for (let index = 0; index <= config.repeat; index++) {
            opt = await outlockOtp.getRecoveryCode(this.email, this.password).catch(() => null);
            if (opt) {
                break;
            }
            await sleep(config.delay);
        }

        await this.page.type('input[name=code]', opt);
        await this.page.keyboard.press('Enter');
    }

    async injectGetOrderScript() {
        try {
            // await this.page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'], timeout: 999999});

            await this.page.addScriptTag({
                content: fs.readFileSync(path.join(__dirname, './injectScript.txt'), 'utf-8')
            });

            await this.page.waitForSelector('h1[id=arp_result]', {
                timeout: 2 * 60 * 1000
            });

            const result = await this.page.evaluate(`document.querySelector("h1[id='arp_result']").innerText`);

            return result;

        } catch (error) {
            console.log(error);
            return null;
        }

    }

    async quitBrowser() {
        await this.browser.close();
    }
}

module.exports = Amazon;
