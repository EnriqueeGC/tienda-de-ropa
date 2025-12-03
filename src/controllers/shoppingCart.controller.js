const db = require('../config/db.js');
const { get } = require('../routes/order.routes.js');
const ShoppingCart = db.ShoppingCart;
const ShoppingCartDetails = db.ShoppingCartDetails;

exports.addToCart = async (req, res) => {
    const { productId, quantity, userId, variantId } = req.body;

    try {
        // Verificar si el carrito del usuario ya existe
        let cart = await ShoppingCart.findOne({ where: { userId, status: 'active' } });

        if (!cart) {
            // Crear un nuevo carrito si no existe
            cart = await ShoppingCart.create({ userId });
        }

        // obtener el id del carrito existente
        const cartId = cart.cartId;

        // Verificar si el producto ya está en el carrito
        let cartDetail = await ShoppingCartDetails.findOne({ where: { cartId, productId, variantId } });

        if (cartDetail) {
            // Actualizar la cantidad del producto en el carrito
            cartDetail.quantity += quantity;
            await cartDetail.save();
        } else {
            // Agregar el producto al carrito si no está presente
            await ShoppingCartDetails.create({ cartId, productId, quantity, variantId });
        }

        res.status(200).json({ message: 'Producto agregado al carrito correctamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar producto al carrito.' });
    }
}

exports.updateCartItem = async (shoppingCartDetail, newQuantity) => {
    try {
        shoppingCartDetail.quantity = newQuantity;
        await shoppingCartDetail.save();
    } catch (error) {
        console.error('Error updating cart item:', error);
        throw error;
    }
}

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

exports.deleteCartItem = async (req, res) => {
    const { shoppingCartDetailId } = req.body;

    try {
        const cartDetail = await ShoppingCartDetails.findByPk(shoppingCartDetailId);

        if (!cartDetail) {
            return res.status(404).json({ message: "Detalle del carrito no encontrado." });
        }

        await cartDetail.destroy();

        res.status(200).json({ message: "Producto eliminado del carrito correctamente." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar producto del carrito." });
    }
};

// eliminar carrito y detalles carrito una vez finalizada la comnpra
exports.deleteCart = async (req, res) => {
    const { userId } = req.body;

    try {
        // Eliminar los detalles del carrito del usuario
        const cart = await ShoppingCart.findOne({ where: { userId, status: 'active' } });

        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado." });
        }

        const cartId = cart.cartId;

        await ShoppingCartDetails.destroy({ where: { cartId } });

        // Eliminar el carrito del usuario
        await cart.destroy();

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
            FROM detallepedido dp
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
    getCartDetails,
    getMostSoldProducts,
};
