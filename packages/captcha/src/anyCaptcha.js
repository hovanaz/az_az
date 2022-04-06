const axios = require('axios');
const config = require('../config.json');
const helper = require('./helper');
const imageToBase64 = require('image-to-base64');
const Timeout = require('await-timeout');

const ANYCAPTCHA_API = 'https://api.anycaptcha.com/';

const anyCaptcha = axios.create({
    baseURL: ANYCAPTCHA_API
});

const createTask = (task = {}) => {
    return anyCaptcha.post('/createTask', {
        clientKey: config.anyCaptchaKey,
        task
    }).then(res => res.data).catch(() => null);
};

const getTaskResult = (taskId) => {
    return anyCaptcha.post('/getTaskResult', {
        clientKey: config.anyCaptchaKey,
        taskId
    }).then(res => res.data).catch(() => null);
};

const solveCaptcha = async (data = {}, config = {
    sleep: 3000,
    repeat: 5
}) => {

    try {
        if (data.body && !data.body.includes('.gif')) {
            delete data.subType;
        }
        if (data.type === 'ImageToTextTask') {
            data.body = await imageToBase64(data.body);
        }

        const createTaskData = await Timeout.wrap(createTask(data), 20000, 'Can\'t create task !');

        if (createTaskData && createTaskData.taskId) {
            let result;
            for (let index = 0; index <= config.repeat; index++) {
                const solution = await Timeout.wrap(getTaskResult(createTaskData.taskId), 10000,
                    'Can\'t get task result !');
                if (solution && solution.errorId == 0 && solution.status && solution.status !== 'processing') {
                    result = solution.solution;
                    break;
                } else {
                    if (solution.errorDescription === 'ERROR_CAPTCHA_UNSOLVABLE') {
                        return null;
                    }
                }
                await helper.sleep(config.sleep);
            }
            return result;
        }
    } catch (error) {
        console.log('can\'t not get captcha', error);
        return null;
    }
};

module.exports = {
    solveCaptcha,
    createTask,
    getTaskResult
};
