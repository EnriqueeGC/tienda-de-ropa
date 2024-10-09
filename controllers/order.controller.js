const db = require('../config/db.js');

const createOrder = async (req, res) => {
    const { id_usuario, id_producto, fecha_pedido, estado_pedido, total_pago, id_ruta } = req.body;

    try {
        const query = ``;
        const id_pedido = { type: db.oracledb.NUMBER, dir: db.oracledb.BIND_OUT };

        const params = { id_usuario, id_producto, cantidad, total, id_orden };
        const result = await db.executeQuery(query, params);

        if (result.outBinds && result.outBinds.id_orden) {
            const newId = result.outBinds.id_orden[0];
            res.status(201).json({
                message: 'Orden ingresada exitosamente',
                id: newId,
                id_usuario,
                id_producto,
                cantidad,
                total
            });
        }
    } catch (err) {
        console.error('Error al ingresar la orden', err);
        res.status(500).json({error: 'Error al ingresar la orden'});
    }
}

