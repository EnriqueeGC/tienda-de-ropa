const db = require('../config/db.js');
const { get } = require('../routes/order.routes.js');

// Agregar un producto al carrito
const addToCart = async (req, res) => {
    const { id_producto, cantidad, id_usuario, id_variante } = req.body; // Agregar id_talla

    try {
        // Verificar si el carrito del usuario ya existe
        let query = `SELECT * FROM CARRITO WHERE USUARIOID = :id_usuario`;
        let params = [ id_usuario ];
        let carrito = await db.executeQuery(query, params);

        if (carrito.rows.length === 0) {
            // Crear un nuevo carrito si no existe
            query = `INSERT INTO carrito (USUARIOID) VALUES (:id_usuario) RETURNING ID_CARRITO INTO :id_carrito`;
            const id_carrito = { type: db.oracledb.NUMBER, dir: db.oracledb.BIND_OUT };
            params = [ id_usuario, id_carrito ];
            const result = await db.executeQuery(query, params);
            
            if (result.outBinds && result.outBinds.id_carrito) {
                carrito = { id_carrito: result.outBinds.id_carrito[0] };
            } else {
                throw new Error("No se pudo crear el carrito");
            }
        } else {
            // Obtener el id del carrito existente
            carrito = carrito.rows[0];
            // console.log('ID CARRITO', carrito.ID_CARRITO);
        }

        // Verificar si el producto ya está en el carrito
        query = `SELECT * FROM DETALLESCARRITO WHERE id_carrito = :id_carrito AND id_producto = :id_producto AND id_variante = :id_variante`;
        params = { id_carrito: carrito.ID_CARRITO, id_producto, id_variante }; // Incluir id_talla en los parámetros
        const detalleCarrito = await db.executeQuery(query, params);

        if (detalleCarrito.rows.length > 0) {
            // Actualizar la cantidad del producto en el carrito
            await updateCartItem(detalleCarrito.rows[0].id_detalle_carrito, cantidad);
        } else {
            // Asegúrate de que id_carrito tenga un valor antes de la inserción
            if (!carrito.ID_CARRITO) {
                throw new Error("ID del carrito no definido");
            }
        
            // Agregar el producto al carrito si no está presente
            query = `INSERT INTO Detallescarrito (id_carrito, id_producto, cantidad, id_variante) VALUES (:id_carrito, :id_producto, :cantidad, :id_variante)`; // Incluir id_talla
            params = { id_carrito: carrito.ID_CARRITO, id_producto, cantidad, id_variante };
        
            await db.executeQuery(query, params);
        }
    
        res.status(200).json({ message: "Producto agregado al carrito correctamente." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al agregar producto al carrito." });
    }
};


// Función para actualizar la cantidad de un producto en el carrito
const updateCartItem = async (id_detalle_carrito, nuevaCantidad) => {
    const query = `UPDATE Detallescarrito SET cantidad = :cantidad WHERE id_detalle_carrito = :id_detalle_carrito`;
    const params = { cantidad: nuevaCantidad, id_detalle_carrito };
    await db.executeQuery(query, params);
};

// Obtener detalles del carrito del usuario
const getCartDetails = async (req, res) => {
    const { id_usuario } = req.params;

    try {
        const query = `SELECT * FROM carrito WHERE USUARIOID = :id_usuario`;
        const params = { id_usuario };
        const carrito = await db.executeQuery(query, params);

        if (carrito.rows.length === 0) {
            return res.status(404).json({ message: "Carrito no encontrado." });
        }

        const id_carrito = carrito.rows[0].ID_CARRITO;

        // Obtener los detalles del carrito con los datos del producto y variantes
        const detallesQuery = `
         SELECT 
                dc.id_detalle_carrito, 
                dc.id_producto, 
                dc.cantidad, 
                p.nombre_producto, 
                p.precio, 
                p.url_imagen, 
                v.id_variante, 
                t.nombre_talla
            FROM Detallescarrito dc
            JOIN PRODUCTO p ON dc.id_producto = p.id_producto
            JOIN VARIANTES_PRODUCTO v ON dc.id_variante = v.id_variante
            JOIN TALLA t ON v.id_talla = t.id_talla
            WHERE dc.id_carrito = :id_carrito`;
        
        const detalles = await db.executeQuery(detallesQuery, { id_carrito });

        res.status(200).json({ carrito: carrito.rows[0], detalles: detalles.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los detalles del carrito." });
    }
};


const deleteCartItem = async (req, res) => {
    const { id_detalle_carrito } = req.body;

    try {
        const query = `DELETE FROM Detallescarrito WHERE id_detalle_carrito = :id_detalle_carrito`;
        const params = { id_detalle_carrito };
        await db.executeQuery(query, params);

        res.status(200).json({ message: "Producto eliminado del carrito correctamente." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar producto del carrito." });
    }
};


// eliminar carrito y detalles carrito una vez finalizada la comnpra
const deleteCart = async (req, res) => {
    const { id_usuario } = req.params;  // Cambiado a req.params para capturar desde la URL

    try {
        // Eliminar los detalles del carrito del usuario
        const query = `DELETE FROM Detallescarrito WHERE id_carrito IN (SELECT ID_CARRITO FROM carrito WHERE USUARIOID = :id_usuario)`;
        const params = { id_usuario };
        await db.executeQuery(query, params);

        // Eliminar el carrito del usuario
        const query2 = `DELETE FROM carrito WHERE USUARIOID = :id_usuario`;
        await db.executeQuery(query2, params);

        res.status(200).json({ message: "Carrito eliminado correctamente." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el carrito." });
    }
};

// Obtener los productos más vendidos
const getMostSoldProducts = async (req, res) => {
    try {
        const query = `
            SELECT 
                dp.id_producto, 
                p.nombre_producto, 
                SUM(dp.cantidad) AS total_vendido
            FROM detalle_pedido dp
            JOIN PRODUCTO p ON dp.id_producto = p.id_producto
            GROUP BY dp.id_producto, p.nombre_producto
            ORDER BY total_vendido DESC
            FETCH FIRST 10 ROWS ONLY`; // Limitar a los 10 productos más vendidos

        const result = await db.executeQuery(query);

        res.status(200).json({ productosMasVendidos: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los productos más vendidos." });
    }
};

module.exports = {
    addToCart,
    getCartDetails,
    updateCartItem,
    deleteCartItem,
    getMostSoldProducts,
    deleteCart
};
