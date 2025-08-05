const db = require('../config/db.js')

const getAllSizes = async (req, res) => {
    try {
        const query = `SELECT * FROM TALLA`;
        const result = await db.executeQuery(query);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Tallas no encontradas' });
        }

        res.status(200).json(result.rows)
    } catch (err) {
        console.error('Error al obtener todas las tallas', err);
        res.status(500).json({ error: 'Error al obtener todas las tallas' });
    }   
}

module.exports = {
    getAllSizes
}