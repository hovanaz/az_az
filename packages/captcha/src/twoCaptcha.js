const axios = require('axios');
const config = require('../config.json');
const helper = require('./helper');
const imageToBase64 = require('image-to-base64');
const Timeout = require('await-timeout');

const BASE_URL = 'http://2captcha.com';

const twoCaptcha = axios.create({
    baseURL: BASE_URL
});

const createTask = (task = {}) => {
    return twoCaptcha.post('/in.php', {
        key: config.twoCaptchaKey,
        method: 'funcaptcha',
        publickey: task.publicKey,
        pageurl: task.pageUrl,
        json: 1
    }).then(res => res.data).catch(() => null);
};

const getTaskResult = (taskId) => {
    return twoCaptcha.get('/res.php', {
        params: {
            key: config.twoCaptchaKey,
            action: 'get',
            id: taskId,
            json: 1
        }
    }).then(res => res.data).catch(() => null);
};

const solveCaptcha = async (data = {}, config = {
    sleep: 20000,
    repeat: 5
}) => {
    try {
        console.log(data);
        const createTaskData = await Timeout.wrap(createTask(data), 20000, 'Can\'t create task !');

        if (createTaskData && createTaskData.request) {
            let result;
            for (let index = 0; index <= config.repeat; index++) {
                const solution = await Timeout.wrap(getTaskResult(createTaskData.request), 10000,
                    'Can\'t get task result !');

                console.log(solution);

                if (solution?.status && solution?.request) {
                    result = solution.request;
                    break;
                }
                await helper.sleep(config.sleep);
            }
            return result;
        }
    } catch (e) {
        console.log(e);
    }
};

module.exports = {
    solveCaptcha,
    createTask,
    getTaskResult
};
//
// (async () => {
//     const result = await solveCaptcha({
//         publicKey: '2F1CD804-FE45-F12B-9723-240962EBA6F8',
//         pageUrl: 'https://www.amazon.com/ap/cvf/request?arb=92d0eec6-56cb-4d31-b228-60cbca6b635e'
//     });
//     console.log({ result });
// })();

