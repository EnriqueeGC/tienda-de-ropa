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

const createOrder = async (req, res) => {
    const {id_usuario, total_pago, detalles} = req.body;

    try {
        const query = `INSERT INTO PEDIDO (id_usuario, fecha_pedido, estado_pedido, total_pago) VALUES (:id_usuario, SYSDATE, 'Pendiente', :total_pago) RETURNING id_pedido INTO :id_pedido`;
        const params = {
            id_usuario,
            total_pago,
            id_pedido: { type: db.oracledb.NUMBER, dir: db.oracledb.BIND_OUT }
        };
        const result = await db.executeQuery(query, params);

        const id_pedido = result.outBinds.id_pedido[0];

        for (const detalle of detalles) {
            const {id_producto, cantidad, precio_unitario, id_variante} = detalle;
            const query = `INSERT INTO DETALLEPEDIDO (id_pedido, id_producto, cantidad, precio_unitario, id_variante) VALUES (:id_pedido, :id_producto, :cantidad, :precio_unitario, :id_variante)`;
            const params = {id_pedido, id_producto, cantidad, precio_unitario, id_variante};
            await db.executeQuery(query, params);
        }

        res.status(201).json({id_pedido});
    }
    catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({error: "Error creating order"});
    }
}

const getOrderDetails = async (req, res) => {
  const { id_usuario, id_pedido } = req.params;

  try {
      // Consultar el pedido específico para el usuario
      const orderQuery = `SELECT id_pedido, fecha_pedido, estado_pedido, total_pago 
                          FROM PEDIDO 
                          WHERE id_usuario = :id_usuario AND id_pedido = :id_pedido`;
      const orderParams = { id_usuario, id_pedido };
      const orderResult = await db.executeQuery(orderQuery, orderParams);

      if (orderResult.rows.length === 0) {
          return res.status(404).json({ error: "Pedido no encontrado" });
      }

      const pedido = orderResult.rows[0];

      // Consultar los detalles del pedido
      const detailsQuery = `SELECT dp.id_producto, dp.cantidad, dp.precio_unitario, p.nombre_producto 
                            FROM DETALLEPEDIDO dp 
                            JOIN PRODUCTO p ON dp.id_producto = p.id_producto 
                            WHERE dp.id_pedido = :id_pedido`;
      const detailsParams = { id_pedido };
      const detailsResult = await db.executeQuery(detailsQuery, detailsParams);

      const detallesPedido = detailsResult.rows.map(row => ({
          id_producto: row.ID_PRODUCTO,
          nombre_producto: row.NOMBRE_PRODUCTO,
          cantidad: row.CANTIDAD,
          precio_unitario: row.PRECIO_UNITARIO
      }));

      res.status(200).json({
          id_pedido: pedido.ID_PEDIDO,
          fecha_pedido: pedido.FECHA_PEDIDO,
          estado_pedido: pedido.ESTADO_PEDIDO,
          total_pago: pedido.TOTAL_PAGO,
          detalles: detallesPedido
      });
  } catch (error) {
      console.error("Error retrieving order details:", error);
      res.status(500).json({ error: "Error retrieving order details" });
  }
};

// Controlador para obtener todos los pedidos y sus detalles por el id del usuario
const getPedidosByUsuario = async (req, res) => {
    const { id_usuario } = req.params;

    const query = `
       SELECT 
    p.id_pedido,
    p.fecha_pedido,
    p.estado_pedido,
    p.total_pago,
    dp.id_detalle_pedido,
    dp.id_producto,
    dp.cantidad,
    dp.precio_unitario,
    dp.id_variante,
    pr.nombre_producto,
    pr.url_imagen
FROM 
    PEDIDO p
INNER JOIN 
    DETALLEPEDIDO dp ON p.id_pedido = dp.id_pedido
INNER JOIN 
    PRODUCTO pr ON dp.id_producto = pr.id_producto
WHERE 
    p.id_usuario = :id_usuario


    `;
    const params = { id_usuario };
    try {
        const pedidos = await db.executeQuery(query, params);
        res.status(200).json({ result: pedidos.rows });
    } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        res.status(500).json({ success: false, message: "Error al obtener los pedidos" });
    }
};


module.exports = { createPedido, createOrder, getOrderDetails, getPedidosByUsuario };