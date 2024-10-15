const db = require('../config/db.js');

// rout /createShoppingCart
const manageShoppingCart = async (req, res) => {
    const { id_usuario, id_producto, cantidad } = req.body;

    try {
        // 1. Verificar si el usuario ya tiene un carrito activo
        let query = `SELECT ID FROM CARRITO WHERE USUARIOID = :id_usuario`;
        let params = [id_usuario];
        let result = await db.executeQuery(query, params);

        let id_carrito;
        
        if (result.rows.length === 0) {
            // 2. Si no tiene carrito, crear uno nuevo
            query = `INSERT INTO CARRITO (USUARIOID, FECHA_CREACION) VALUES (:id_usuario, SYSDATE) RETURNING ID INTO :id_carrito`;
            params = [id_usuario];
            const newCart = await db.executeQuery(query, params);
            id_carrito = newCart.outBinds.id_carrito;  // Capturar el ID del carrito recién creado
        } else {
            // 3. Si ya existe un carrito, obtener su ID
            id_carrito = result.rows[0].ID;
        }

        // 4. Insertar el producto en el carrito (detalle)
        query = `INSERT INTO DETALLESCARRITO (ID_CARRITO, ID_PRODUCTO, CANTIDAD) VALUES (:id_carrito, :id_producto, :cantidad)`;
        params = [id_carrito, id_producto, cantidad];
        await db.executeQuery(query, params);

        return res.status(200).json({ message: 'Producto agregado al carrito exitosamente' });

    } catch (error) {
        console.error('Error al manejar el carrito:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// actualizar cantidad de producto en carrito
const updateProductQuantity = async (req, res) => {
    const { id_carrito, id_producto, cantidad } = req.body;

    try {
        const query = `UPDATE DETALLESCARRITO SET CANTIDAD = :cantidad WHERE ID_CARRITO = :id_carrito AND ID_PRODUCTO = :id_producto`;
        const params = [cantidad, id_carrito, id_producto];

        const result = await db.executeQuery(query, params);

        return res.status(200).json({ message: 'Cantidad de producto actualizada exitosamente' });

    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// eliminar producto de carrito
const deleteProductFromCart = async (req, res) => {
    const { id_carrito, id_producto } = req.body;

    try {
        const query = `DELETE FROM DETALLESCARRITO WHERE ID_DETALLE_CARRITO = :id_carrito AND ID_PRODUCTO = :id_producto`;
        const params = [id_carrito, id_producto];

        const result = await db.executeQuery(query, params);

        return res.status(200).json({ message: 'Producto eliminado del carrito exitosamente' });

    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// obtener carrito por id de usuario
const getCartByUserId = async (req, res) => {
    const { id_usuario } = req.body;

    try {
        const query = `SELECT * FROM CARRITO WHERE USUARIOID = :id_usuario`;
        const params = [id_usuario];

        const result = await db.executeQuery(query, params);

        return res.status(200).json({ carrito: result.rows });

    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}