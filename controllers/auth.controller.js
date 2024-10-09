const db = require('../config/db.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;  // Clave secreta para firmar el token

const login = async (req, res) => {
    const { nombre_usuario, contrasena } = req.body;

    try {
        // Consulta para verificar si el usuario existe
        const query = `SELECT * FROM USUARIO WHERE NOMBREUSUARIO = :nombre_usuario`;
        const params = [nombre_usuario];

        const result = await db.executeQuery(query, params);

        if (result.rows.length === 0) {
            // Si no se encuentra ningún usuario, devolver error
            return res.status(401).json({ message: 'Nombre de usuario incorrecto.' });
        }

        const usuario = result.rows[0];

        // Comparar la contraseña ingresada con la contraseña encriptada en la base de datos
        const contrasenaCorrecta = await bcrypt.compare(contrasena, usuario.CONTRASENA);
        
        if (!contrasenaCorrecta) {
            // Si la contraseña no coincide, devolver error
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar un token JWT si la contraseña es correcta
        const token = jwt.sign(
            {
                id: usuario.ID,  // Puedes ajustar el payload del token como quieras
                nombre_usuario: usuario.NOMBRE_USUARIO
            },
            SECRET_KEY,
            { expiresIn: '1h' }  // El token expirará en 1 hora
        );

        // Enviar la respuesta con el token
        return res.status(200).json({
            message: 'Login exitoso',
            token
        });

    } catch (error) {
        console.error('Error en el login:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error('Error al verificar el token:', err);
            return res.status(401).json({ message: 'Token inválido' });
        }

        // Agregar el ID del usuario al objeto req para que esté disponible en los controladores
        req.userId = decoded.id;
        next();
    });
}

const isAdmin = async (req, res, next) => {
    const userId = req.userId;

    try {
        // Consulta para verificar si el usuario es administrador
        const query = `SELECT * FROM USUARIO WHERE ID = :userId`;
        const params = [userId];

        const result = await db.executeQuery(query, params);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const usuario = result.rows[0];

        if (usuario.ROL !== 'ADMIN') {
            return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
        }

        next();

    } catch (error) {
        console.error('Error al verificar si el usuario es administrador:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}



module.exports = { login };