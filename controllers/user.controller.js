const db = require('../config/db.js');
const bcrypt = require('bcrypt');

const SECRET_KEY = 'proyectoUMG';

const registerUser = async (req, res) => {
    const { nombre, apellido, direccion, correoElectronico, telefono, nombreUsuario, contrasena, rolID} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        const query = `INSERT INTO USUARIO (NOMBRE, APELLIDO, DIRECCION, CORREOELECTRONICO, TELEFONO, NOMBREUSUARIO, CONTRASENA, ROLID) VALUES (:nombre, :apellido, :direccion, :correoElectronico, :telefono, :nombreUsuario, :contrasena, :rolID)`
        const params = [nombre, apellido, direccion, correoElectronico, telefono, nombreUsuario, hashedPassword, rolID];

        const result = await db.executeQuery(query, params);

        res.status(201).json({
            message: 'Usuario registrado exitosamente', 
            result
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al registrar al usuario' });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const query = `SELECT * FROM USUARIO`;
        const result = await db.executeQuery(query)

        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Error al buscar usuarios'});
    }
}

const getUsersById = async (req, res) => {
    const { usuarioId } = req.params;

    try {
        const query = `SELECT * FROM USUARIO WHERE USUARIOID = :USUARIOID`;
        const result = await db.executeQuery(query, [usuarioId]);

        if (result.rows.length === 0){
            return res.status(404).json({ message: 'Usurio no encontrado'});
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al buscar el usuairo'});
    }
}

const getUsersByName = async (req, res) => {
    const { nombre } = req.query; // query para enviar multiples prametros opcionales en formato clave-valor despues del signo '?' -> ruta/getUserByName?nombre=ejemplo

    if (!nombre) {
        return res.status(400).json({ error: 'El parámetro nombre es requerido' });
    }
    try {
        const query = `
        SELECT * FROM USUARIO 
        WHERE LOWER(NOMBRE) LIKE LOWER(:nombre)
        OR SOUNDEX(NOMBRE) = SOUNDEX(:nombre)`;
        const params = { nombre: `%${nombre}%`};
        
        const result = await db.executeQuery(query, params);

        if (result.rows.length === 0){
            return res.status(404).json({ message: 'No se encontraron usuarios'});
        }

        res.status(200).json({message: result.rows});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error del servidor'});
    }
}

const getUserBySecondName = async (req, res) => {
    const { apellido } = req.query;

    if (!apellido) {
        return res.status(400).json({ error: 'El parámetro apellido es requerido' });
    }
    try {
        const query = `SELECT * FROM USUARIO 
                        WHERE LOWER(APELLIDO) LIKE LOWER(:APELLIDO)
                        OR SOUNDEX(APELLIDO) = SOUNDEX(:APELLIDO)`;
        const params = { apellido: `%${apellido}%` }
        
        const result = await db.executeQuery(query, params);

        if (result.rows.length === 0){
            return res.status(404).json({ message: 'No se encontraron usuarios'});
        }

        res.status(200).json({message: result.rows});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al buscar a los usuarios'});
    }
}

const deleteUserById = async (req, res) => {
    const { usuarioId }  = req.params;

    try {
        const query = `DELETE FROM USUARIO WHERE USUARIOID = :USUARIOID`;
        const params = [usuarioId];

        const result = await db.executeQuery(query, params);

        if (result.rowsAffected === 0){
            return res.status(404).json({ message: 'Usuario no encontrado'});
        }

        res.status(200).json({ message: 'Usuario eliminado exitosamente'});
    } catch (err) {
        console.error('Error al eliminar al Usuario: ', err);
        res.status(500).json({error: 'Error al eliminar al usuario'})
    }
}

const updateUser = async (req, res) => {
    const { usuarioID } = req.params;
    const { nombre, apellido, direccion, correoElectronico, telefono, nombreUsuario, contrasena, rolID} = req.body;
    
    try {
        const hashedPassword = contrasena ? await bcrypt.hash(contrasena, 10) : null;
        const query = `
                UPDATE USUARIO
                SET
                    NOMBRE = :nombre,
                    APELLIDO = :apellido,
                    DIRECCION = :direccion,
                    CORREOELECTRONICO= :correoElectronico,
                    TELEFONO = :telefono,
                    NOMBREUSUARIO = :nombreUsuario,
                    CONTRASENA = :contrasena,
                    ROLID = :rolID
                WHERE USUARIOID = :usuarioID
        `;
        const params = [nombre, apellido, direccion, correoElectronico, telefono, nombreUsuario, hashedPassword, rolID, usuarioID];

        const result = await db.executeQuery(query, params);

        if (result.rowsAffected === 0){
            return res.status(404).json({message: 'Usuario no encontrado'})
        }
        
        res.status(200).json({ message: `Usuario actualizado exitosamenete.`, 
            result
        });
    } catch (err) {
        console.error('Error al actualizar al usuario: ', err);
        res.status(500).json({error: 'Error al actualizar al usuario'})
    }
}

module.exports = {
    registerUser,
    getAllUsers,
    getUsersById,
    getUsersByName,
    getUserBySecondName,
    deleteUserById,
    updateUser
}