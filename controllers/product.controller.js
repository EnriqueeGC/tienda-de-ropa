const db = require('../config/db.js')

const createProduct = async (req, res) => {
    const {nombre_producto, descripcion, precio, id_categoria, id_descuento, stock } = req.body;

    try {
        const query = `INSERT INTO PRODUCTO (NOMBRE_PRODUCTO, DESCRIPCION, PRECIO, ID_CATEGORIA, ID_DESCUENTO, STOCK) VALUES (:nombre_producto, :descripcion, :precio, :id_categoria, :id_descuento, :stock) RETURNING ID_PRODUCTO INTO :id_producto`;
        const id_producto = { type: db.oracledb.NUMBER, dir: db.oracledb.BIND_OUT };

        const params = { nombre_producto, descripcion, precio, id_categoria, id_descuento, stock, id_producto };
        const result = await db.executeQuery(query, params);

        if (result.outBinds && result.outBinds.id_producto) {
            const newId = result.outBinds.id_producto[0];
            res.status(201).json({
                message: 'Producto ingresado exitosamente',
                id: newId,
                nombre_producto,
                descripcion,
                precio,
                id_categoria,
                id_descuento,
                stock
            });
        }
    } catch (err) {
        console.error('Error al ingresar el articulo', err);
        res.status(500).json({error: 'Error al ingresar el articulo'});
    }
}

const getAllProducts = async (req, res) => {
    try {
        const query = `SELECT * FROM PRODUCTO`;
        const result = await db.executeQuery(query);

        if (result.rows.length === 0){
            return res.status(404).json({ message: 'Productos no encontrados'});
        }

        res.status(200).json(result.rows)
    } catch (err) {
        console.error('Error al obtener todos los Productos', err);
        res.status(500).json({error: 'Error al obtener todos los productos'});
    }
}

const getProductById = async (req, res) => {
    const { id_producto } = req.params;

    try {
        const query = `SELECT * FROM PRODUCTO WHERE ID_PRODUCTO = :id_producto`;
        const params = [id_producto];
        const result = await db.executeQuery(query, params);

        if (result.rows.length === 0){
            return res.status(404).json({ message: `Producto no encontrado con el id: ${id_producto}`});
        }

        res.status(200).json(result.rows[0])
    } catch (err) {
       console.error('Error al obtener los productos', err);
       res.status(500).json({message: 'Error al obtener el producto'});
    }
}

const getProductByName = async (req, res) => {
    const { nombre_producto } = req.query;

    try {
        const query = `
        SELECT * FROM PRODUCTO
        WHERE LOWER(NOMBRE_PRODUCTO) LIKE LOWER(:nombre_producto)
        OR SOUNDEX(NOMBRE_PRODUCTO) = SOUNDEX(:nombre_producto)`;

        const params = { nombre_producto: `%${nombre_producto}%` };
        const result = await db.executeQuery(query, params);

        if (result.rows.length === 0){
            return res.status(404).json({ message: `No existen coincidencias con el nombre ${nombre_producto}`});
        }

        res.status(200).json(result.rows)
    } catch (err) {
        console.error('Error al buscar el producto', err);
        res.status(500).json({error: 'Error al buscar el producto'});
    }
}

const deleteProductById = async (req, res) => {
    const { id_producto } = req.params;

    try {
        const query = `DELETE FROM PRODUCTO WHERE ID_PRODUCTO = :ID_PRODUCTO`;
        const params = [id_producto];
        const result = await db.executeQuery(query, params)

        if (result.rowsAffected === 0){
            return res.status(404).json({message: `Articulo no encontrado con el id ${id_producto}`});
        }

        res.status(200).json({ 
            message: 'Producto eliminado exitosamente',
            id_producto: id_producto
        });
    } catch (err) {
        console.error('Error al eliminar el producto', err);
        res.status(500).json({error: 'Error al eliminar el producto'});
    }
}

const updateProductById = async (req, res) => {
    const { nombre_producto, descripcion, precio, id_categoria, id_descuento, stock } = req.body;
    const { id_producto }  = req.params;

    try {
        const query = `
            UPDATE PRODUCTO
            SET
                NOMBRE_PRODUCTO = :nombre_producto,
                DESCRIPCION = :descripcion,
                PRECIO = :precio,
                ID_CATEGORIA = :id_categoria,
                ID_DESCUENTO = :id_descuento,
                STOCK = :stock
            WHERE ID_PRODUCTO = :id_producto      
        `;
        const params = [ nombre_producto, descripcion, precio, id_categoria, id_descuento, stock, id_producto];
        const result = await db.executeQuery(query, params);

        if (result.rowsAffected === 0){
            return res.status(404).json({message: 'Producto no encontrado'});
        }
        
        res.status(200).json({message: `Producto actualizado exitosamente con el id: ${id_producto}`,
            id_producto,
            nombre_producto,
            descripcion,
            precio,
            id_categoria,
            id_descuento,
            stock
        })
    } catch (err) {
        console.error('Error al actualizar el producto', err);
        res.status(500).json({error: 'Error al actualizar el producto'});
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    getProductByName,
    deleteProductById,
    updateProductById,
}