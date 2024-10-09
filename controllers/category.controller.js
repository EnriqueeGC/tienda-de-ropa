const db = require('../config/db.js');

const createCategory = async (req, res) => {
    const { nombre_categoria, genero } = req.body;

    try {
        const query = `INSERT INTO CATEGORIA (NOMBRE_CATEGORIA, GENERO) VALUES (:nombre_categoria, :genero) RETURNING ID_CATEGORIA INTO :id_categoria`;
        const id_categoria = { type: db.oracledb.NUMBER, dir: db.oracledb.BIND_OUT };
        const params = {
            nombre_categoria,
            genero,
            id_categoria
        };

        const result = await db.executeQuery(query, params);

        if (result.outBinds && result.outBinds.id_categoria) {
            const newId = result.outBinds.id_categoria[0];
            res.status(201).json({
                message: 'Categoría ingresada exitosamente',
                id: newId,
                nombre_categoria,
                genero
            });
        } else {
            throw new Error('No se pudo obtener el ID de la categoría recién creada.');
        }
    } catch (error) {
        console.error(`Error al crear categoría: ${error}`);
        res.status(500).json({ error: 'Error al crear una nueva categoría' });
    }
};

const getAll = async (req, res) => {
    try {
        const query = `SELECT * FROM CATEGORIA`;
        const result = await db.executeQuery(query);

        if (result.rows && result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            throw new Error('No se encontraron categorías');
        }
        
    } catch (error) {
        console.error(`Error al obtener categorías: ${error}`);
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
}

const getCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `SELECT * FROM CATEGORIA WHERE ID_CATEGORIA = :id`;
        const params = { id };
        const result = await db.executeQuery(query, params);

        if (result.rows && result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            throw new Error('No se encontró la categoría');
        }
    } catch (error) {
        console.error(`Error al obtener categoría: ${error}`);
        res.status(500).json({ error: 'Error al obtener categoría' });
    }
}

const getCategoryByName = async (req, res) => {
    const { nombre_categoria } = req.query;

    if (!nombre_categoria) {
        return res.status(400).json({ error: 'El parámetro nombre_categoria es requerido' });
    }

    try {
        const query = `SELECT * FROM CATEGORIA 
                        WHERE LOWER(NOMBRE_CATEGORIA) LIKE LOWER(:nombre_categoria)
                        OR SOUNDEX(NOMBRE_CATEGORIA) = SOUNDEX(:nombre_categoria)`;
        const params = { nombre_categoria: `%${nombre_categoria}%`}
        const result = await db.executeQuery(query, params);

        if (result.rows && result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            throw new Error('No se encontró la categoría');
        }
    } catch (error) {
        console.error(`Error al obtener categoría: ${error}`);
        res.status(500).json({ error: 'Error al obtener categoría' });
    }
}

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { nombre_categoria, genero } = req.body;

    try {
        const query = `UPDATE CATEGORIA SET NOMBRE_CATEGORIA = :nombre_categoria, GENERO = :genero WHERE ID_CATEGORIA = :id`;
        const params = {
            nombre_categoria,
            genero,
            id
        };
        const result = await db.executeQuery(query, params);

        if (result.rowsAffected && result.rowsAffected > 0) {
            res.status(200).json({
                message: 'Categoría actualizada exitosamente',
                id,
                nombre_categoria,
                genero
            });
        } else {
            throw new Error('No se pudo actualizar la categoría');
        }
    } catch (error) {
        console.error(`Error al actualizar categoría: ${error}`);
        res.status(500).json({ error: 'Error al actualizar categoría' });
    }
}

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM CATEGORIA WHERE ID_CATEGORIA = :id`;
        const params = { id };
        const result = await db.executeQuery(query, params);

        if (result.rowsAffected && result.rowsAffected > 0) {
            res.status(200).json({
                message: 'Categoría eliminada exitosamente',
                id
            });
        } else {
            throw new Error('No se pudo eliminar la categoría');
        }
    } catch (error) {
        console.error(`Error al eliminar categoría: ${error}`);
        res.status(500).json({ error: 'Error al eliminar categoría' });
    }
}

module.exports = {
    createCategory,
    getAll,
    getCategoryById,
    updateCategory,
    deleteCategory
}