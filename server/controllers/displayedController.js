// server/controllers/displayedController
'use strict';


const Displayed = require('../models/displayed');


exports.create = function (req, res) {
    const visit = req.body;
    addRequestParams(visit, req);
    console.log(visit);
    Displayed.save(visit, (err) => {
        if (err) {
            console.log(err);
            return res.status(400).send({
                error: err,
            });
        }

        return res.status(200).send({
            success: 'success',
        });
    });
};


function addRequestParams(visit, req) {
    const userAgent = req.headers['user-agent'];

    console.log(visit);
    // add ip

    visit.ip = req.connection.remoteAddress;

    // add os
    // add Browser

    if (userAgent) {
        visit.browser = getBrowser(userAgent);
        visit.os = getOS(userAgent);
    }

    visit.other = userAgent;
}

function getOS(userAgent) {
    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return 'Windows Phone';
    } else if (/android/i.test(userAgent)) {
        return 'Android';
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 'iOS';
    }

    // Mac detection
    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/Mac/.test(userAgent)) {
        return 'MacOS';
    }
    // CHEck if this is correct
    if (/Win/.test(userAgent)) {
        return 'Windows';
    }

    if (/BlackBerry/.test(userAgent)) {
        return 'BlackBerry';
    }

    if (/Linux/.test(userAgent)) {
        return 'BlackBerry';
    }

    return '';
}

function getBrowser(ua) {
    console.log(ua);
    let tem;
    console.log('despues de M');

    let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    console.log('despues de M');
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
}
