function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function PhanTichDuLieu(data_html) {
    var patt = /<span class="num-orders">(.*?)<\/span>/g;
    var result = data_html.match(patt);
    str = result + '';
    str = str.replace('<span class="num-orders">', '');
    str = str.replace('orders</span>', '');
    str = str.replace('order</span>', '');
    return str;
}

function PhanTichSoNam(data_html) {
    var arr = [];
    var patt = /<option value="year-\d\d\d\d+"/g;
    var result = data_html.match(patt);
    for (var i = 0; i < result.length; i++) {
        var patt_num = /\d+/g;
        var result2 = result[i].match(patt_num);
        arr.push(parseInt(result2));
    }
    return arr;

}

var gOBJ = 0;
let amrResult = {};

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function LayDuLieu() {
    gOBJ = 0;
    const ARR = [];
    const landau = httpGet(
        'https://www.amazon.com/gp/your-account/order-history?opt=ab&digitalOrders=1&unifiedOrders=1&returnTo=&orderFilter=year-2020');
    const run_arr = PhanTichSoNam(landau);
    let thongtinnhanthan = false;
    for (var i = (run_arr.length - 1); i >= 0; i--) {
        console.log('đang chạy năm:' + run_arr[i]);
        const html1 = httpGet(
            'https://www.amazon.com/gp/your-account/order-history?opt=ab&digitalOrders=1&unifiedOrders=1&returnTo=&orderFilter=year-' +
            run_arr[i]);
        const ketqua = PhanTichDuLieu(html1);
        if (ketqua > 0) {
            if (thongtinnhanthan == false) {
                gOBJ = run_arr[i];
                thongtinnhanthan = true;
            }
            ARR.push({ nam: run_arr[i], sodong: ketqua });
            return ARR;
        }
    }
    return ARR;
}


function LayThongTinNhanThan(nam) {
    amrResult.year = nam;

    document.getElementById(
        'nav-main').innerHTML = `<iframe style="z-index: 111; " id="orderFrame" name="orderFrame" src="https://www.amazon.com/gp/your-account/order-history?opt=ab&digitalOrders=1&unifiedOrders=1&returnTo=&orderFilter=year-${nam}" width="500px" height="500px"/>`;
    const orderFrame = document.getElementById('walletFrame');

    orderFrame.addEventListener('load', async function (e) {
        const orderDocument = orderFrame.contentDocument
            ? orderFrame.contentDocument
            : orderFrame.contentWindow.document;
        const triggleOrderAddressElement = orderDocument.querySelector('a[aria-label="Link to Shipping Address"]');
        if (!triggleOrderAddressElement) {
            return;
        }
        await sleep(2000);
        const addressElement = orderDocument.getElementById('a-popover-content-1');

        const address = (addressElement || 'No Address').innerText.trim().replace(/(\r\n|\n|\r)/gm, ', ');
        console.log({ address });
    });
}

function LayThongTinDiaChi(nam) {
    document.getElementById(
        'nav-main').innerHTML = `<iframe style="z-index: 111; " id="walletFrame" name="walletFrame" src="https://www.amazon.com/cpe/yourpayments/wallet?ref_=ya_d_c_pmt_mpo" width="500px" height="500px"/>`;
    const walletFrame = document.getElementById('walletFrame');

    walletFrame.addEventListener('load', async function (e) {
        const walletDocument = walletFrame.contentDocument
            ? walletFrame.contentDocument
            : walletFrame.contentWindow.document;

        const printResult = (address = 'Unknown') => {
            const infoColumn = walletDocument.querySelectorAll('div[class="a-fixed-left-grid-col a-col-right"]');
            const payment = (infoColumn && infoColumn[0] && infoColumn[0].innerText) || '';
            const gifCartBalance = (infoColumn && infoColumn[1] && infoColumn[1].innerText) || '';

            amrResult = {
                year: nam,
                address: (address || '').replace(/(\r\n|\n|\r)/gm, ', '),
                payment: payment.replace(/(\r\n|\n|\r)/gm, ' '),
                gifCartBalance: gifCartBalance.replace(/(\r\n|\n|\r)/gm, ' '),
                text: [address, payment, gifCartBalance, nam].join('|').replace(/(\r\n|\n|\r)/gm, ' ')
            };

            document.body.innerHTML = `<h1 id="arp_result">${JSON.stringify(amrResult)}</h1>`;
        };

        const editBtn = walletDocument.querySelector('[aria-label="edit payment method"]');
        if (!editBtn) {
            return printResult('Unknown');
        }

        editBtn.click();

        new Promise((resolve) => {
            setTimeout(() => {
                resolve('No Address');
            }, 3 * 60 * 1000);
            const waitAddNewAddress = setInterval(() => {
                const addNewAddressElement = walletDocument.querySelector(
                    'input[name="ppw-widgetEvent:ShowSelectAddressEvent"]');
                if (addNewAddressElement) {
                    resolve('No Address');
                    clearInterval(waitAddNewAddress);
                }
            }, 1000);
        }).then(noAddress => {
            printResult(noAddress);
        });

        new Promise(async (resolve) => {
            setTimeout(() => {
                resolve('No Address');
            }, 3 * 60 * 1000);
            const waitLoaded = setInterval(() => {
                const billingAddressElements = walletDocument.getElementsByClassName('pmts-address-section');
                if (billingAddressElements.length && billingAddressElements[0]) {
                    const billingAddress = (billingAddressElements[0].innerHTML || '').replace(/\n/g, ',');
                    resolve(billingAddress);
                    clearInterval(waitLoaded);
                }
            }, 1000);
        }).then(address => {
            printResult(address);
        });

    });
}

function getElementByXpath(dc, path) {
    return dc.evaluate(path, dc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function main() {
    var arr = LayDuLieu();
    var str = '';
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].sodong > 0) {
            str = str + arr[i].nam;
        }
    }
    if (arr.length > 0) {
        if (gOBJ > 0) {
            LayThongTinNhanThan(gOBJ);
        }
    } else {
        document.body.innerHTML = '<h1 id="arp_result"> No Order </h1>';
    }

}

//LayThongTinNhanThan(2001);
main();
