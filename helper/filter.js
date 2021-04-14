const url = require('url');
exports.isJson = function (str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};
exports.isDefine = function (p, o, t) {
    if (typeof p[o] === 'undefined' || p[o] === null || p[o] === '') {
        return {
            status: false,
            msg: 'Missing parameter: ' + o
        };
    }
    if (typeof p[o] !== t) {
        return {
            status: false,
            msg: "Expected '" + t + "' on key '" + o + "'"
        };
    }
    return {
        status: true
    };
};
exports.isEmail = function (email) {
    regexPositive = ['^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'];
    var reg = new RegExp(
        regexPositive
    );
    var isMeetRegex = email.match(reg)
        ? true
        : false;
    if (!isMeetRegex) {
        return {
            status: false,
            msg: 'Invalid email format'
        };
    }
    return {
        status: true
    };

}

exports.getUrlParams = (req) => {
    let isError = false;
    try {
        var queryObject = url.parse(req.url, true)
        queryObject = queryObject.query;
        let objKeys = Object.keys(queryObject);
        objKeys.forEach(key=>{
            if (typeof queryObject[key] !== 'string'){
                queryObject[key] = queryObject[key].join(',')
            }
        })
    } catch (e) {
        console.log(e)
        isError = true;
    }
    if (isError){
        return {status: false, msg: "Bad url params"}
    };
    return {
        status: true,
        data: JSON.parse(JSON.stringify(queryObject))
    };
};