const db = require('../config/db.js');

const createPedido = async (req, res) => {
    const { id_usuario, total_pago } = req.body;
    try {
        const query = `INSERT INTO PEDIDO (id_usuario, fecha_pedido, estado_pedido, total_pago) VALUES (:id_usuario, SYSDATE, 'Pendiente', :total_pago) RETURNING id_pedido INTO :id_pedido`;
        const params = {
            id_usuario,
            total_pago,
            id_pedido: { type: db.NUMBER, dir: db.BIND_OUT }
        };
        const result = await db.executeQuery(query, params);
    
        const id_pedido = result.outBinds.id_pedido[0];
      res.status(201).json({ id_pedido });
    } catch (error) {
      console.error("Error creating pedido:", error);
      res.status(500).json({ error: "Error creating pedido" });
    }
  };
  
  module.exports = { createPedido };