exports.init = function (p) {

    var err = false;
    var DB = p.DB,
        FILTER = p.FILTER;

    //filter
    var check = FILTER.isDefine(p.data, 'featureName', 'string');
    if (!check.status) {
        return check;
    }
    var check = FILTER.isDefine(p.data, 'email', 'string');
    if (!check.status) {
        return check;
    }
    var check = FILTER.isDefine(p.data, 'enable', 'boolean');
    if (!check.status) {
        return check;
    }
    var check = FILTER.isEmail(p.data.email);
    if (!check.status) {
        return check;
    }

    return new Promise(async(resolve, reject) => {

        var response = await checkFeature(p);
        if(typeof response.data === 'undefined'){
            var res = await insertFeature(p);
        }else{
            var res = await updateFeature(p);
        }
        return resolve(res);

    })
};

function checkFeature(p) {
    return new Promise(async(resolve, reject) => {
    p.DB.getConnection(function (poolErr, conn) {
        if (poolErr) {
            conn.release();
            return resolve({
                status: false,
                msg: 'PoolError',
                code: 1
            });
        }
        sql = "select id,status from feature_access where email = ? and feature_name =?  limit 1"
        conn.query(sql, [p.data.email, p.data.featureName], async function (err, data) {
            conn.release();
            if (err) {
                return resolve({
                    status: false,
                    msg: 'ConnError',
                    code: 2
                });
            }
            return resolve({
                data : data[0]
            });
        });
    });
    });
}
function updateFeature(p) {
    return new Promise(async(resolve, reject) => {
    p.DB.getConnection(function (poolErr, conn) {
        if (poolErr) {
            conn.release();
            return resolve({
                status: false,
                msg: 'PoolError',
                code: 1
            });
        }
        sql = "update feature_access set status = ? where email = ? and feature_name =?  limit 1"
        conn.query(sql, [p.data.enable,p.data.email,p.data.featureName], async function (err, data) {
            conn.release();
            if (err) {
                return resolve({
                    status: false,
                    msg: 'ConnError',
                    code: 2
                });
            }
            if(data.changedRows < 1){
                return resolve({
                    status  : true,
                    httpCode : true
                });
            }
            return resolve({
            });
        });
    });
    });
}
function insertFeature(p) {
    return new Promise(async(resolve, reject) => {
    p.DB.getConnection(function (poolErr, conn) {
        if (poolErr) {
            conn.release();
            return resolve({
                status: false,
                msg: 'PoolError',
                code: 1
            });
        }
        sql = "insert into  feature_access (email,feature_name,status) values (?,?,?) "
        conn.query(sql, [p.data.email,p.data.featureName,p.data.enable], async function (err, data) {
            conn.release();
            if (err) {
                return resolve({
                    status: false,
                    msg: 'ConnError',
                    code: 2
                });
            }
            if(data.affectedRows < 1){
                return resolve({
                    status  : true,
                    httpCode : true
                });
            }
            return resolve({
            });
        });
    });
    });
}