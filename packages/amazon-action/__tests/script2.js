function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
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
        arr.push(parseInt(result2));  //cái code này đi a , code này e edit lại cho phù hợp với tool , a chỉnh trên code này giúp e nha

    }
    return arr;

}

var gOBJ = 0;
let amrResult = {};

function LayDuLieu() {
    gOBJ = 0;
    var ARR = [];
    var landau = httpGet(
        'https://www.amazon.com/gp/your-account/order-history?opt=ab&digitalOrders=1&unifiedOrders=1&returnTo=&orderFilter=year-2020');
    var run_arr = PhanTichSoNam(landau);
    var thongtinnhanthan = false;
    for (var i = (run_arr.length - 1); i >= 0; i--) {
        console.log('đang chạy năm:' + run_arr[i]);
        var html1 = httpGet(
            'https://www.amazon.com/gp/your-account/order-history?opt=ab&digitalOrders=1&unifiedOrders=1&returnTo=&orderFilter=year-' +
            run_arr[i]);
        //   console.log(html1 ) ;
        var ketqua = PhanTichDuLieu(html1);
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

var gThongTin = '';

function LayThongTinNhanThan(nam) {
    amrResult.year = nam;

    var newFrame = document.createElement('frame');
    newFrame.id = 'myNewFrame';
    newFrame.name = 'myNewFrame';
    newFrame.src = 'https://www.amazon.com/gp/your-account/order-history?opt=ab&digitalOrders=1&unifiedOrders=1&returnTo=&orderFilter=year-' +
        nam;
    //document.body.appendChild(newFrame);
    document.body.insertBefore(newFrame, document.body.firstChild);
    setTimeout(function () {
        var element = window.frames['myNewFrame'].document.getElementsByClassName('trigger-text')[0];
        if (typeof (element) != 'undefined' && element != null) {
            // Exists.
            console.log('Exists');
        } else {
            console.log('not Exists');
            LayThongTinDiaChi(nam);
            return;
        }
        window.frames['myNewFrame'].document.getElementsByClassName('trigger-text')[0].click();

        var displayAddressFullName = window.frames['myNewFrame'].document.getElementsByClassName(
            'displayAddressFullName')[0].innerHTML;

        try {
            var displayAddressAddressLine1 = window.frames['myNewFrame'].document.getElementsByClassName(
                'displayAddressAddressLine1')[0].innerHTML;
        } catch (err) {
            try {
                var displayAddressAddressLine1 = window.frames['myNewFrame'].document.getElementsByClassName(
                    'displayAddressAddressLine2')[0].innerHTML;

            } catch (err) {
                var displayAddressAddressLine1 = '';
            }

        }

        var displayAddressCityStateOrRegionPostalCode = window.frames['myNewFrame'].document.getElementsByClassName(
            'displayAddressCityStateOrRegionPostalCode')[0].innerHTML;

        var displayAddressCountryName = window.frames['myNewFrame'].document.getElementsByClassName(
            'displayAddressCountryName')[0].innerHTML;

        var displayAddressPhoneNumber = window.frames['myNewFrame'].document.getElementsByClassName(
            'displayAddressPhoneNumber')[0].innerHTML;
        displayAddressPhoneNumber = displayAddressPhoneNumber.replace('<span dir="ltr">', '');
        displayAddressPhoneNumber = displayAddressPhoneNumber.replace('</span>', '');

        gThongTin = displayAddressFullName + ' ' + displayAddressAddressLine1 + ' ' +
            displayAddressCityStateOrRegionPostalCode + ' ' + displayAddressCountryName + ' ' +
            displayAddressPhoneNumber;

        amrResult.address = gThongTin;
        window.frames['myNewFrame'].document.getElementsByClassName('trigger-text')[0].click();

        var arr_link = window.frames['myNewFrame'].document.getElementsByClassName('a-link-normal');

        for (var i = 0; i < arr_link.length; i++) {
            if (arr_link[i].innerHTML.trim() == 'View order details') {
                document.getElementById('myNewFrame').src = 'https://www.amazon.com/' +
                    arr_link[i].getAttribute('href');
                setTimeout(function () {

                    try {
                        var Grand_Total = getElementByXpath(window.frames['myNewFrame'].document,
                            '//*[@id="od-subtotals"]/div[7]/div[2]/span').textContent.trim();
                    } catch (err) {
                        var Grand_Total = '1';
                    }  //xóa cái bước get total này luôn đi a , cho nó xử lý ít lại

                    if (Grand_Total == '$0' || Grand_Total == '$0.00') {
                        gThongTin = gThongTin + ' |Payment:' + 'Order by gift';  // vì không xem được nên bỏ cái này luôn đi a bỏ cái này
                        amrResult.payment = 'Order by gift';

                        // hiển thị : Order by gift
                    } else {
                        try {
                            var Payment_Method = getElementByXpath(window.frames['myNewFrame'].document,
                                '//*[@id="orderDetails"]/div[4]/div/div/div/div[1]/div/div[2]/div[1]/div/div/span').
                                textContent.
                                trim();
                            gThongTin = gThongTin + ' |Payment:' + Payment_Method;
                            amrResult.payment = Payment_Method;
                        } catch (err) {
                            var Payment_Method = '';
                        }

                    }
                    // rứa là lấy cái này pahri ko
                    document.getElementById(
                        'myNewFrame').src = 'https://www.amazon.com/gc/balance/ref=gc_balance_legacy_to_newgcf?_encoding=UTF8&ref_=ya_d_c_gc';
                    setTimeout(function () {   //a giữ cái này nha , cái này vẫn dùng dc á
                        try {
                            var Your_Gift_Card_Balance = getElementByXpath(window.frames['myNewFrame'].document,
                                '//*[@id="gc-ui-balance-gc-balance-value"]').textContent.trim();
                            gThongTin = gThongTin + ' |Gift:' + Your_Gift_Card_Balance;

                        } catch (err) {
                            var Your_Gift_Card_Balance = '';
                        }
                        amrResult.gifCartBalance = Your_Gift_Card_Balance;

                        var btn = document.createElement('textarea');
                        btn.setAttribute('id', 'thongtin');
                        document.body.appendChild(btn);
                        document.getElementById('thongtin').value = gThongTin;
                        gThongTin = gThongTin + '[Default]';
                        amrResult.text = gThongTin;
                        document.body.innerHTML = `<h1 id="arp_result">${JSON.stringify(amrResult)}</h1>`;

                        document.getElementById(
                            'myNewFrame').src = 'https://www.amazon.com/gp/your-account/order-history?opt=ab&digitalOrders=1&unifiedOrders=1&returnTo=&orderFilter=year-' +
                            nam;
                        // setTimeout(function () { CopyText(gThongTin) }, 100);
                    }, 2000);

                }, 2000);

                break;
            }

        }
    }, 2000);
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



        new Promise( (resolve) => {
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
        var btn = document.createElement('input');

        btn.setAttribute('id', 'order');
        btn.setAttribute('value', str);

        document.body.appendChild(btn);

        if (gOBJ > 0) {
            LayThongTinNhanThan(gOBJ);
        }
    } else {
        var btn = document.createElement('input');

        btn.setAttribute('id', 'order');
        btn.setAttribute('value', 'No Order');
        document.body.innerHTML = '<h1 id="arp_result"> No Order </h1>';
    }

}

//LayThongTinNhanThan(2001);
main();
