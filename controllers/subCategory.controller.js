const db = require('../config/db.js');

const create = async (req, res) => {
    const { id_categoria, nombre } = req.body;

    try {
        const query = `INSERT INTO subcategorias (id_categoria, nombre) VALUES (:id_categoria, :nombre)`;
        const params = { id_categoria, nombre };
        const result = await db.executeQuery(query, params);

        res.status(201).json({
            message: 'Subcategoría ingresada exitosamente',
            id_categoria,
            nombre
        });
    } catch (error) {
        console.error('Error interno del servidor', error);
        res.status(500).json({ error: 'Error al ingresar la subcategoría' });
    }
    
}

const getAll = async (req, res) => {
    try {
        const query = `SELECT * FROM subcategorias`;
        const result = await db.executeQuery(query);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error interno del servidor', error);
        res.status(500).json({ error: 'Error al obtener las subcategorías' });
    }
}

const getSubcategoriesByCategoryId = async (req, res) => {
    const { id_categoria } = req.params;  // Obtener el ID de la categoría desde los parámetros de la ruta

    try {
        // Modificar la consulta SQL para filtrar por ID de categoría
        const query = `SELECT * FROM subcategorias WHERE ID_CATEGORIA = :id_categoria`;
        const result = await db.executeQuery(query, [id_categoria]);  // Pasar el ID como parámetro

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No se encontraron subcategorías para esta categoría' });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error interno del servidor', error);
        res.status(500).json({ error: 'Error al obtener las subcategorías' });
    }
}

const deleteById = async (req, res) => {
    const { id_subcategoria } = req.params;

    try {
        // Primero obtener el nombre y id_categoria de la subcategoría antes de eliminarla
        const getQuery = `SELECT nombre, id_categoria FROM subcategorias WHERE id_subcategoria = :id_subcategoria`;
        const getResult = await db.executeQuery(getQuery, [id_subcategoria]);

        if (getResult.rows.length === 0) {
            return res.status(404).json({ message: `Subcategoría no encontrada con el id: ${id_subcategoria}` });
        }

        // Extraer los datos de la subcategoría
        const { NOMBRE: nombre, ID_CATEGORIA: id_categoria } = getResult.rows[0];

        // Realizar la eliminación
        const deleteQuery = `DELETE FROM subcategorias WHERE id_subcategoria = :id_subcategoria`;
        const deleteResult = await db.executeQuery(deleteQuery, [id_subcategoria]);

        if (deleteResult.rowsAffected === 0) {
            return res.status(404).json({ message: `Subcategoría no encontrada con el id: ${id_subcategoria}` });
        }

        // Responder con los datos de la subcategoría eliminada
        res.status(200).json({ 
            message: 'Subcategoría eliminada exitosamente',
            id_subcategoria,
            nombre,
            id_categoria
        });
    } catch (error) {
        console.error('Error interno del servidor', error);
        res.status(500).json({ error: 'Error al eliminar la subcategoría' });
    }
};

module.exports = {
    create,
    getAll,
    getSubcategoriesByCategoryId,
    deleteById
};