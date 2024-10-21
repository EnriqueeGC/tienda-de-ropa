const db = require('../config/db.js')

const addVariants = async (req, res) => {
    const { id_producto } = req.params;
    const { id_talla, stock } = req.body;

    try {
        const query = `INSERT INTO VARIANTES_PRODUCTO (ID_PRODUCTO, ID_TALLA, STOCK) VALUES (:id_producto, :id_talla, :stock)`;
        const params = [id_producto, id_talla, stock];
        const result = await db.executeQuery(query, params);

        res.status(201).json({
            message: 'Variantes ingresadas exitosamente',
            id_producto,
            id_talla,
            stock
        });
    } catch (err) {
        console.error('Error al ingresar las variantes', err);
        res.status(500).json({ error: 'Error al ingresar las variantes' });
    }
}

const getAllVariantsProduct = async (req, res) => {
    const { id_producto } = req.params;

    try {
        const query = `
            SELECT 
                V.ID_VARIANTE, 
                V.STOCK, 
                T.NOMBRE_TALLA 
            FROM 
                VARIANTES_PRODUCTO V
            INNER JOIN 
                TALLA T ON V.ID_TALLA = T.ID_TALLA
            WHERE 
                V.ID_PRODUCTO = :id_producto`;

        const params = [id_producto];
        const result = await db.executeQuery(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: `Variantes no encontradas para el producto con id: ${id_producto}` });
        }

        res.status(200).json(result.rows)
    } catch (error) {   
        console.error('Error al obtener las variantes', error);
        res.status(500).json({ error: 'Error al obtener las variantes' });    
    }
}

const deleteVariantById = async (req, res) => {
    const { id_variante } = req.params;

    try {
        const query = `DELETE FROM VARIANTES_PRODUCTO WHERE ID_VARIANTE = :id_variante`;
        const params = [id_variante];
        const result = await db.executeQuery(query, params)

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: `Variante no encontrada con el id ${id_variante}` });
        }

        res.status(200).json({
            message: 'Variante eliminada exitosamente',
            id_variante: id_variante
        });
    } catch (err) {
        console.error('Error al eliminar la variante', err);
        res.status(500).json({ error: 'Error al eliminar la variante' });
    }
}

const updateVariantById = async (req, res) => {
    const { id_talla, stock } = req.body;
    const { id_variante } = req.params;

    try {
        const query = `
            UPDATE VARIANTES_PRODUCTO
            SET
                ID_TALLA = :id_talla,
                STOCK = :stock
            WHERE ID_VARIANTE = :id_variante      
        `;
        const params = [id_talla, stock, id_variante];
        const result = await db.executeQuery(query, params);

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'Variante no encontrada' });
        }

        res.status(200).json({
            message: `Variante actualizada exitosamente con el id: ${id_variante}`,
            id_variante,
            id_talla,
            stock
        })
    } catch (err) {
        console.error('Error al actualizar la variante', err);
        res.status(500).json({ error: 'Error al actualizar la variante' });
    }
}

module.exports = {
    addVariants,
    getAllVariantsProduct,
    deleteVariantById,
    updateVariantById
}