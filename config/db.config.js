require('dotenv').config();

module.exports = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: '(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1521)(host=adb.us-ashburn-1.oraclecloud.com))(connect_data=(service_name=geeb562edc24945_tiendaropa_medium.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))'
}

