const oracledb = require('oracledb');
const dbconfig = require('./db.config.js');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const executeQuery = async (query, params = []) => {
    let connection;

    try {
        connection = await oracledb.getConnection(dbconfig);
        const result = await connection.execute(query, params, { autoCommit: true});
        return result;
    } catch (error) {
        console.error(`Error al ejecutar la consulta ${error}`);
        throw error;
    } finally {
        if (connection){
            try {
                await connection.close();
            } catch (error) {
                console.error(`Error al cerrar la conexion ${error}`);
            }
        }
    }
}

module.exports = {executeQuery, oracledb}

/* 
const initialize = async () => {
    let connection;

    try {
        connection = await oracledb.getConnection(dbconfig);
        console.log('Conexion exitosa');

        const result = await connection.execute('SELECT * FROM ROL');
        console.log(result.rows);
    } catch (error) {
        console.error(`Error al conectarse a la base de datos: ${error}`);
    } finally {
        if(connection){
            try {
                await connection.close();
            } catch (error) {
                console.error(`Error al cerrar la conexion ${error}`);
            }
        }
    }
}

initialize()
*/