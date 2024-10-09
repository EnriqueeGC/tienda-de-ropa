const db = require('../config/db.js');

// rout /createDiscount
const createDiscount = async (req, res) => {
    const { tipo_descuento, valor_descuento, fecha_inicio, fecha_fin } = req.body;

    try {
        const query = `
      INSERT INTO DESCUENTO (TIPO_DESCUENTO, VALOR_DESCUENTO, FECHA_INICIO, FECHA_FIN)
      VALUES (:tipo_descuento, :valor_descuento, TO_DATE(:fecha_inicio, 'YYYY-MM-DD'), TO_DATE(:fecha_fin, 'YYYY-MM-DD'))
      RETURNING ID_DESCUENTO INTO :id_descuento
    `;
        const id_descuento = { type: db.oracledb.NUMBER, dir: db.oracledb.BIND_OUT };
        const params = { tipo_descuento, valor_descuento, fecha_inicio, fecha_fin, id_descuento };
        const result = await db.executeQuery(query, params);

        if (result.outBinds && result.outBinds.id_descuento) {
            const newId = result.outBinds.id_descuento[0];
            res.status(201).json({
                message: 'Descuento ingresado exitosamente',
                id: newId,
                tipo_descuento,
                valor_descuento,
                fecha_inicio,
                fecha_fin
            });
        } else {
            throw new Error('No se pudo obtener el ID del descuento recién creado.');
        }
    } catch (error) {
        console.error(`Error al crear descuento: ${error}`);
        res.status(500).json({ error: 'Error al crear un nuevo descuento' });
    }
}

const getAllDiscounts = async (req, res) => {
    try {
        const query = `SELECT * FROM DESCUENTO`;
        const result = await db.executeQuery(query);

        if (result.rows && result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            throw new Error('No se encontraron descuentos');
        }
        
    } catch (error) {
        console.error(`Error al obtener descuentos: ${error}`);
        res.status(500).json({ error: 'Error al obtener descuentos' });
    }
}

const getDiscountById = async (req, res) => {
    const { id_descuento } = req.params;

    try {
        const query = `SELECT * FROM DESCUENTO WHERE ID_DESCUENTO = :id_descuento`;
        const params = [id_descuento];
        const result = await db.executeQuery(query, params);

        if (result.rows && result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: `Descuento no encontrado con el id: ${id}`});
        }
    } catch (error) {
        console.error(`Error al obtener descuento: ${error}`);
        res.status(500).json({ error: 'Error al obtener descuento' });
    }
}

const getDiscountByType = async (req, res) => {
    const { tipo_descuento } = req.query;

    if (!tipo_descuento) {
        return res.status(400).json({ error: 'El parámetro tipo_descuento es requerido' });
    }

    try {
        const query = `SELECT * FROM DESCUENTO 
                        WHERE LOWER(TIPO_DESCUENTO) LIKE LOWER(:tipo_descuento)
                        OR SOUNDEX(TIPO_DESCUENTO) = SOUNDEX(:tipo_descuento)`;
        const params = { tipo_descuento: `%${tipo_descuento}%` };
        
        const result = await db.executeQuery(query, params);

        if (result.rows.length === 0){
            return res.status(404).json({ message: 'No se encontraron descuentos'});
        }

        res.status(200).json({message: result.rows});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error al obtener el descuento'});
    }
}

const updateDiscount = async (req, res) => {
    const { id } = req.params;
    const { tipo_descuento, valor_descuento, fecha_inicio, fecha_fin } = req.body;

    try {
        const query = `
        UPDATE DESCUENTO 
        SET 
            TIPO_DESCUENTO = :tipo_descuento, 
            VALOR_DESCUENTO = :valor_descuento, 
            FECHA_INICIO = :fecha_inicio, 
            FECHA_FIN = :fecha_fin 
            WHERE ID_DESCUENTO = :id`;
        const params = {
            tipo_descuento,
            valor_descuento,
            fecha_inicio,
            fecha_fin,
            id
        };
        const result = await db.executeQuery(query, params);

        if (result.rowsAffected && result.rowsAffected > 0) {
            res.status(200).json({
                message: 'Descuento actualizado exitosamente',
                id,
                tipo_descuento,
                valor_descuento,
                fecha_inicio,
                fecha_fin
            });
        } else {
            res.status(404).json({ message: `Descuento no encontrado con el id: ${id}`});
        }
    } catch (error) {
        console.error(`Error al actualizar descuento: ${error}`);
        res.status(500).json({ error: 'Error al actualizar descuento' });
    }
}

const deleteDiscountById = async (req, res) => {
    const { id }  = req.params;

    try {
        const query = `DELETE FROM DESCUENTO WHERE ID_DESCUENTO = :id`;
        const params = [id];
        const result = await db.executeQuery(query, params);

        if (result.rowsAffected && result.rowsAffected > 0) {
            res.status(200).json({ message: 'Descuento eliminado exitosamente', id });
        } else {
            res.status(404).json({ message: `Descuento no encontrado con el id: ${id}`});
        }
    } catch (error) {
        console.error(`Error al eliminar descuento: ${error}`);
        res.status(500).json({ error: 'Error al eliminar descuento' });
    }
}

module.exports = { 
    createDiscount,
    getAllDiscounts,
    getDiscountById,
    getDiscountByType,
    updateDiscount,
    deleteDiscountById
}