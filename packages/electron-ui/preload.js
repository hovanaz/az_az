const { ipcRenderer } = require('electron');
var forceStop = 0;
var stopPosition = 0;

function getConfigs() {
    const thread = document.getElementById('thread').value;
    const changeIPAfter = document.getElementById('changeIPAfter').value;
    const changeIPWith = document.querySelector('input[name=changeIPWith]').value;
    const hardlessMode = document.getElementById('hardlessMode').checked;
    const guessName = document.getElementById('guessName').checked;
    const debugMode = document.getElementById('debugMode').value;
    const googleApis = document.getElementById('googleAPIs').value;
    const changeIPCommand = document.getElementById('changeIPCommand').value;
    const googleSheet = document.getElementById('googleSheet').value;

    return {
        thread,
        changeIPAfter,
        changeIPWith,
        hardlessMode,
        googleApis,
        guessName,
        changeIPCommand,
        googleSheet,
        debugMode
    };
}

const changeIP = (cmd = '') => {
    const command = getConfigs().changeIPCommand;

    return ipcRenderer.sendSync(
        'changeIP', {
            command
        });
};

const setResultCount = (type = 'success', increase = 0, isSetMode = false) => {
    const element = document.getElementById(type);
    const value = (element && element.innerText);
    if (isSetMode) {
        element.innerText = increase;
    } else {
        element.innerText = (Number(value) || 0) + increase;
    }
};

function jsonEscape(str) {
    return str.replace(/\n/g, '\\\\n').replace(/\r/g, '\\\\r').replace(/\t/g, '\\\\t');
}

let index = 0;
ipcRenderer.on('status', (event, arg) => {
    const { account, status, result, message } = arg;

    if (status === 'doing') {
        setResultCount('run', 1);
        if (!document.getElementById(account.email)) {
            const htmlAppend = `
                    <tr id='${account.email}'>
                        <td>${++index}</td>
                        <td>${account.email}</td>
                        <td>${account.password}</td>
                        <td id="status_${account.email}"><span class="badge bg-info text-dark">DOING</span></td>
                        <td class="output" id="output_${account.email}">
                        </td>
                        <td class="log">
                          <ul id="log_${account.email}">
    
                          </ul>
                        </td>
                      </tr>
            `;
            document.getElementById('result').insertAdjacentHTML('afterbegin', htmlAppend);
        } else {
            document.getElementById(
                'status_' + account.email).innerHTML = '<span class="badge bg-info text-dark">DOING</span>';
            const logList = document.getElementById('log_' + account.email);

            logList.insertAdjacentHTML('afterbegin', `<li class="badge bg-info text-dark">Run again</li>`);
        }

    } else {
        const statusHTML = {
            done: '<span class="badge rounded-pill bg-success">Success</span>',
            error: '<span class="badge rounded-pill bg-danger">Error</span>',
            runAgain: '<span class="badge rounded-pill bg-info">Run Again</span>'
        };

        if (status === 'alldone') {
            document.getElementById('start').style.display = 'block';
            document.getElementById('stop').style.display = 'none';
            alert('Done !!!');
        }

        if (status === 'done') { // status bằng done nè m
            setResultCount('success', 1);
            try {
                console.log(result)
                if(result == "No Order"){
                    addToSheet('No-Order', {
                        ...account
                    });
                }

                const info = JSON.parse(jsonEscape(result.replace(/(\r\n|\n|\r)/gm, ', ')));
               
                    addToSheet('Success', {
                        ...account,
                        orderYear: info.year,
                        address: info.address.replace(/(\r\n|\n|\r)/gm, ', '),
                        text: info.text
                    });
               
               

            } catch (e) {
               
                
                console.log(e);
                console.log('Fail to add to sheet !');
            }
            document.getElementById('status_' + account.email).innerHTML = statusHTML[status];
            document.getElementById(`output_${account.email}`).innerHTML = `<code>${result}</code>`;
        }
        if (status === 'error') {
            let logMessage = message;
            setResultCount('error', 1);
            if (message && message.includes('CONNECTION')) {
                changeIP();
            }

            const logElement = document.getElementById('status_' + account.email);

            if (message.includes('avigation') || message.includes('CONNECTION') || message.includes('too much') ||
                message.includes('Spam ND') || message.includes('Inject fail') || message.includes('Need Change IP') ||
                message.includes('Can') || message.includes('No Address')) {
                if (logElement.innerText.includes('Question') && message.includes('Spam ND')) {
                    logElement.innerHTML = statusHTML[status];
                } else {
                    logElement.innerHTML = statusHTML.runAgain;
                    addToSheet('RunAgain', {
                        ...account,
                        reason: message
                    });
                }
            } else {
                logElement.innerHTML = statusHTML[status];
            }
            const logList = document.getElementById(`log_${account.email}`);

            //* Change IP when have error *//
            if (message.includes('Need Change IP')) {
                changeIP();
            }
            logList.insertAdjacentHTML('afterbegin', `<li class="badge rounded-pill bg-danger">${logMessage}</li>`);
        }
    }

});
ipcRenderer.on('log', (event, arg) => {
    const { log, account } = arg;
    const logList = document.getElementById('log_' + account.email);
    logList.insertAdjacentHTML('afterbegin', `<li class="badge bg-light text-dark">${log}</li>`);
});

const runAccount = (account, configs = {}) => {
    return new Promise((resolve, reject) => {
        try {
            const runTimeOut = setTimeout(() => {
                resolve('Timeout');
            }, 5 * 60 * 1000);

            ipcRenderer.send('runAccount', {
                account,
                configs
            });

            ipcRenderer.on('runAccount', (event, result) => {
                const { account: resultAccount } = result;
                if (account === resultAccount) {
                    clearTimeout(runTimeOut);
                    resolve(result);
                }
            });
        } catch (e) {
            resolve('has error');
        }
    });
};

const addToSheet = (sheetTitle = 'Success', row = {}) => {
    const configs = getConfigs();
    return ipcRenderer.sendSync('addToSheet', {
        sheetTitle,
        sheetId: configs.googleSheet,
        row
    });
};

window.addEventListener('DOMContentLoaded', () => {

    const syncSettings = (settings = {}) => {
        console.log({ settings });
        document.getElementById('thread').value = settings.thread;
        document.getElementById('changeIPAfter').value = settings.changeIPAfter;
        document.querySelector('input[name=changeIPWith]').value = settings.changeIPWith;
        document.getElementById('hardlessMode').checked = settings.hardlessMode;
        document.getElementById('guessName').checked = settings.hardlessMode;
        document.getElementById('googleAPIs').value = settings.googleApis;
        document.getElementById('debugMode').value = settings.debugMode;
        document.getElementById('changeIPCommand').value = settings.changeIPCommand;
        document.getElementById('googleSheet').value = settings.googleSheet;
    };

    const settings = ipcRenderer.sendSync('loadSettings');
    syncSettings(settings);

    const changeButtonLayout = (afterAction) => {
        const startBtn = document.getElementById('start');
        const stopBtn = document.getElementById('stop');
        const continueBtn = document.getElementById('continue');
        const endBtn = document.getElementById('end');
        switch (afterAction) {
            case 'start':
                startBtn.style.display = 'none';
                stopBtn.style.display = 'block';
                endBtn.style.display = 'block';
                break;
            case 'stop':
                startBtn.style.display = 'none';
                stopBtn.style.display = 'none';
                continueBtn.style.display = 'block';
                break;
            case 'continue':
                stopBtn.style.display = 'block';
                continueBtn.style.display = 'none';
                break;
            case 'end':
                stopBtn.style.display = 'none';
                continueBtn.style.display = 'none';
                startBtn.style.display = 'block';
                endBtn.style.display = 'none';
                break;
            default:
                break;
        }
    };

    const start = async function (startPosition = 0, actionType = 'start') {
        let wasRunCount = 0;
        const account = document.getElementById('account').value;
        const accounts = account.split('\n');

        if (actionType === 'start') {
            setResultCount('total', accounts.length, true);
        }

        const configs = getConfigs();
        const thread = Number((configs && configs.thread) || 0);
        const changeIPAfter = Number(configs && configs.changeIPAfter || 0);

        for (let index = startPosition; index < accounts.length; index += thread) {
            if (wasRunCount >= changeIPAfter) {
                changeIP(configs.changeIPCommand);
                wasRunCount = 0;
            }
            wasRunCount += thread;

            const allPromises = accounts.slice(index, index + thread).map((account) => {
                return runAccount(account, configs);
            });

            await Promise.all(allPromises);
            if (forceStop) {
                stopPosition = index;
                break;
            }
        }
    };

    document.getElementById('start').onclick = () => {
        forceStop = false;
        changeButtonLayout('start');
        start(0);
    };

    document.getElementById('stop').onclick = () => {
        forceStop = true;
        changeButtonLayout('stop');
    };

    document.getElementById('continue').onclick = () => {
        forceStop = false;
        changeButtonLayout('continue');
        start(stopPosition, 'continue');
    };

    document.getElementById('end').onclick = () => {
        forceStop = true;
        changeButtonLayout('end');
    };

    document.getElementById('testChangeIp').onclick = () => {
        const configs = getConfigs();
        if (configs.changeIPCommand && configs.changeIPCommand !== '') {
            const result = changeIP(configs.changeIPCommand);
            if (result.status) {
                alert('Change IP Success');
            } else {
                alert('Error: ' + result.message);
            }
        } else {
            alert('911 command not found');
        }
    };

    document.getElementById('testSheetSync').onclick = () => {
        addToSheet('RunAgain', {
            email: 'emai@test.com',
            password: 'test@12',
            reason: 'test'
        });
        addToSheet('Success', {
            email: 'emai@test.com',
            password: 'test@12',
            orderYear: '1999',
            address: 'test_address',
            text: 'test test test'
        });

    };

    document.getElementById('googleSheet').onchange = e => {
        const sheetId = e.target.value;
        document.getElementById(
            'googleSheetLink').href = `https://docs.google.com/spreadsheets/d/${sheetId}/edit#gid=0`;
    };

    document.getElementById('toggleTable').onclick = () => {
        const tableContainer = document.getElementById('table-container');
        const tableDisplay = tableContainer.style.display;
        tableContainer.style.display = (tableDisplay === 'none') ? 'block' : 'none';
    };

    document.getElementById('saveSetting').onclick = () => {
        console.log('save settins');
        const configs = getConfigs();
        const result = ipcRenderer.sendSync('saveSetting', {
            configs
        });

        if (result) {
            alert('Saved !');
        } else {
            alert('Error ! Try Again !');
        }
    };

});
