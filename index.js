const PORT = process.env.PORT || 5000;
const ENV = process.env.ENV || "developmet";
const CONSTANT = require('./config/constant');
const FILTER = require('./helper/filter');
const MYSQL = require('mysql');
const URL = require('url');
const API_REGISTER = require('./config/register');
const API_POST = API_REGISTER.postAPI();
const API_GET = API_REGISTER.getAPI();

global.Request = require('request');

var http = require('http');

// Db Connection
var DB = MYSQL.createPool({
    host: CONSTANT.get("mysql").host,
    user: CONSTANT.get("mysql").user,
    password: CONSTANT.get("mysql").pwd,
    database: CONSTANT.get("mysql").dbname,
    connectionLimit: 50,
    multipleStatements: true,
    charset: 'utf8mb4'
});

// Create Server
http.createServer(function (request, response) {
    var method = request.method;
    var url = request.url;
    var res;
    //Headers for Response
    // response.writeHead(200, {
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    //     'Access-Control-Allow-Methods': 'GET,POST'
    // });
    const PATHNAME = URL.parse(url).pathname; // localhost:8000/filename/api
    const path = PATHNAME.split('/'); 
    let body = [];
    request.on('data', chunk => {
        body.push(chunk);
    }).on('end', async () => {

        body = Buffer.concat(body).toString();
        try {
            body = JSON.parse(body);
        } catch (e) {
            body = [];
        }
        // Parameters to All API's       
        var myObject = {
            DB: DB,
            FILTER: FILTER,
            CONSTANT: CONSTANT,
            ENV: ENV,
            METHOD: method,
            data: body,
            URL: url,
        }

        if (method !== 'POST' && method !== 'GET') {
            res = {
                status: false,
                msg: 'InvalidMethod'
            };
        } else if (method == 'POST' &&  API_POST.indexOf(path[1]) === -1) { // Check for Valid API 
            res = {
                status: false,
                msg: 'InvalidAPI'
            };
        } else if (method == 'GET' &&  API_GET.indexOf(path[1]) === -1) { // Check for Valid API 
            res = {
                status: false,
                msg: 'InvalidAPI'
            };
        }else {
            if (method == 'POST' ){
                var apps = require('./api-post/' + path[1]);
                res = await apps.init(myObject);
            }else{
                data = FILTER.getUrlParams(request);
                myObject.data = data.data;
                var apps = require('./api-get/' + path[1]);
                res = await apps.init(myObject);
            }         
        }
        code = 200;
        if(res.httpCode){
        code = 304
        }
        response.writeHead(code, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            'Access-Control-Allow-Methods': 'GET,POST'
        });
        response.end(JSON.stringify(res), 'utf-8');
    });

}).listen(PORT);
console.log(`Money Lion server running in ${ENV} | PORT: ${PORT} | Starttime: ${new Date()}`);


