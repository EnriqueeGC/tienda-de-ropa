const db = require('../config/db.js');

const createOrderDetails = async (req, res) => {
    const { id_pedido } = req.params;
    const { id_producto, cantidad, precio_unitario } = req.body;

    try {
        const query = `INSERT INTO DETALLE_PEDIDO (id_pedido, id_producto, cantidad, precio_unitario) VALUES (:id_pedido, :id_producto, :cantidad, :precio_unitario)`;
        const params = { id_pedido, id_producto, cantidad, precio_unitario };
        await db.executeQuery(query, params);

        res.status(201).json({ message: 'Order detail created successfully' });
    } catch (error) {
        console.error('Error creating order detail:', error);
        res.status(500).json({ error: 'Error creating order detail' });
    }
}

module.exports = { createOrderDetails };