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
    var check = FILTER.isEmail(p.data.email); 
    if (!check.status) {
        return check;
    }

    return new Promise((resolve, reject) => { 
        DB.getConnection(function (poolErr, conn) {
            if (poolErr) {
                conn.release();
                return resolve({
                    status: false,
                    msg: 'PoolError',
                    code: 1
                });
            }
            sql = "select count(1)  as count from feature_access where email = ? and feature_name =? and status = 1"
            conn.query(sql, [p.data.email, p.data.featureName], async function (err, data) {
                conn.release();
                if (err) {
                    return resolve({
                        status: false,
                        msg: 'ConnError',
                        code: 2
                    });
                }
                if(data[0].count < 1) {
                    return resolve({
                        "canAccess": false
                    });
                }
                return resolve({
                    "canAccess": true
                });
            });        
        });
    })
};
