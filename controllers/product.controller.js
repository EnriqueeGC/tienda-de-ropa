const db = require('../config/db.js')
const multer = require('multer');
const { storage } = require('../config/cloudinary.js');
const cloudinary = require('cloudinary').v2;
const upload = multer({ storage });

const createProduct = async (req, res) => {
    const { nombre_producto, descripcion, precio, id_subcategoria, id_descuento, genero, marca } = req.body;

    try {
        // Subir imagen a Cloudinary
        let url_imagen = null;
        if (req.file) { // Si el archivo existe
            const result = await cloudinary.uploader.upload(req.file.path);
            url_imagen = result.secure_url; // Obtener la URL segura de la imagen
        }

        const query = `INSERT INTO PRODUCTO (NOMBRE_PRODUCTO, DESCRIPCION, PRECIO, ID_SUBCATEGORIA, ID_DESCUENTO, GENERO, MARCA, URL_IMAGEN) VALUES (:nombre_producto, :descripcion, :precio, :id_subcategoria, :id_descuento, :genero, :marca, :url_imagen) RETURNING ID_PRODUCTO INTO :id_producto`;
        const id_producto = { type: db.oracledb.NUMBER, dir: db.oracledb.BIND_OUT };

        const params = { nombre_producto, descripcion, precio, id_subcategoria, id_descuento,  genero, marca, url_imagen, id_producto };
        const result = await db.executeQuery(query, params);

        if (result.outBinds && result.outBinds.id_producto) {
            const newId = result.outBinds.id_producto[0];
            res.status(201).json({
                message: 'Producto ingresado exitosamente',
                id: newId,
                nombre_producto,
                descripcion,
                precio,
                id_subcategoria,
                id_descuento,
                genero,
                marca,
                url_imagen
            });
        }
    } catch (err) {
        console.error('Error al ingresar el producto', err);
        res.status(500).json({ error: 'Error al ingresar el producto' });
    }
}

const getAllProducts = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    // Calcula el offset en función de la página y el límite
    const offset = (page - 1) * limit;

    try {
        //const query = `SELECT * FROM PRODUCTO`;
        const query = `
           SELECT 
            P.ID_PRODUCTO, 
            P.NOMBRE_PRODUCTO,
            P.DESCRIPCION,
            P.PRECIO,
            P.GENERO,
            P.MARCA,
            P.URL_IMAGEN,
            S.NOMBRE AS NOMBRE_SUBCATEGORIA,
            JSON_ARRAYAGG(JSON_OBJECT('talla' VALUE T.NOMBRE_TALLA, 'stock' VALUE V.STOCK)) AS TALLAS_STOCK
        FROM 
            PRODUCTO P
        LEFT JOIN
            VARIANTES_PRODUCTO V ON P.ID_PRODUCTO = V.ID_PRODUCTO
        LEFT JOIN 
            TALLA T ON V.ID_TALLA = T.ID_TALLA
        LEFT JOIN
            SUBCATEGORIAS S ON P.ID_SUBCATEGORIA = S.ID_SUBCATEGORIA
        GROUP BY 
            P.ID_PRODUCTO, P.NOMBRE_PRODUCTO, P.DESCRIPCION, P.PRECIO, P.GENERO, P.MARCA, S.NOMBRE, P.URL_IMAGEN
            OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`; // Añade paginación en SQL

        const params = [offset, limit];
        const result = await db.executeQuery(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Productos no encontrados' });
        }

        res.status(200).json(result.rows)
    } catch (err) {
        console.error('Error al obtener todos los Productos', err);
        res.status(500).json({ error: 'Error al obtener todos los productos' });
    }
}

const getProductById = async (req, res) => {
    const { id_producto } = req.params;

    try {
        const query = `
            SELECT
                P.ID_PRODUCTO,
                P.NOMBRE_PRODUCTO,
                P.DESCRIPCION,
                P.PRECIO,
                P.GENERO,
                P.MARCA,
                P.URL_IMAGEN,
                S.NOMBRE AS NOMBRE_SUBCATEGORIA,
                JSON_ARRAYAGG(JSON_OBJECT('talla' VALUE T.NOMBRE_TALLA, 'stock' VALUE V.STOCK)) AS TALLAS_STOCK
            FROM
                PRODUCTO P
            LEFT JOIN
                VARIANTES_PRODUCTO V ON P.ID_PRODUCTO = V.ID_PRODUCTO
            LEFT JOIN
                TALLA T ON V.ID_TALLA = T.ID_TALLA
            LEFT JOIN
                SUBCATEGORIAS S ON P.ID_SUBCATEGORIA = S.ID_SUBCATEGORIA
            WHERE
                P.ID_PRODUCTO = :id_producto
            GROUP BY
                P.ID_PRODUCTO, P.NOMBRE_PRODUCTO, P.DESCRIPCION, P.PRECIO, P.GENERO, P.MARCA, S.NOMBRE, P.URL_IMAGEN`;
        const params = [id_producto];
        const result = await db.executeQuery(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: `Producto no encontrado con el id: ${id_producto}` });
        }

        res.status(200).json(result.rows[0])
    } catch (err) {
        console.error('Error al obtener los productos', err);
        res.status(500).json({ message: 'Error al obtener el producto' });
    }
}

//obtener productos por genero
const getProductsByGender = async (req, res) => {
    const { genero, page = 1, limit = 10 } = req.query;

    // Calcula el offset en función de la página y el límite
    const offset = (page - 1) * limit;

    try {
        const query = `
            SELECT
                P.ID_PRODUCTO,
                P.NOMBRE_PRODUCTO,
                P.DESCRIPCION,
                P.PRECIO,
                P.MARCA,
                P.URL_IMAGEN,
                S.NOMBRE AS NOMBRE_SUBCATEGORIA,
                JSON_ARRAYAGG(JSON_OBJECT('talla' VALUE T.NOMBRE_TALLA, 'stock' VALUE V.STOCK)) AS TALLAS_STOCK
            FROM
                PRODUCTO P
            LEFT JOIN
                VARIANTES_PRODUCTO V ON P.ID_PRODUCTO = V.ID_PRODUCTO
            LEFT JOIN
                TALLA T ON V.ID_TALLA = T.ID_TALLA
            LEFT JOIN
                SUBCATEGORIAS S ON P.ID_SUBCATEGORIA = S.ID_SUBCATEGORIA
            WHERE
                P.GENERO = :genero
            GROUP BY
                P.ID_PRODUCTO, P.NOMBRE_PRODUCTO, P.DESCRIPCION, P.PRECIO, P.MARCA, S.NOMBRE, P.URL_IMAGEN
            OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`; // Añade paginación en SQL

        const params = [genero, offset, limit];
        const result = await db.executeQuery(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: `No existen productos para el género ${genero}` });
        }

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error al obtener los productos', err);
        res.status(500).json({ message: 'Error al obtener los productos' });
    }
};

const getProductByName = async (req, res) => {
    const { nombre_producto } = req.query;

    try {
        const query = `
        SELECT * FROM PRODUCTO
        WHERE LOWER(NOMBRE_PRODUCTO) LIKE LOWER(:nombre_producto)
        OR SOUNDEX(NOMBRE_PRODUCTO) = SOUNDEX(:nombre_producto)`;

        const params = { nombre_producto: `%${nombre_producto}%` };
        const result = await db.executeQuery(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: `No existen coincidencias con el nombre ${nombre_producto}` });
        }

        res.status(200).json(result.rows)
    } catch (err) {
        console.error('Error al buscar el producto', err);
        res.status(500).json({ error: 'Error al buscar el producto' });
    }
}

const deleteProductById = async (req, res) => {
    const { id_producto } = req.params;

    try {
        // Eliminar todas las versiones del producto en VERSIONES_PRODUCTO
        const deleteVersionsQuery = `DELETE FROM VARIANTES_PRODUCTO WHERE ID_PRODUCTO = :ID_PRODUCTO`;
        const versionParams = [id_producto];
        await db.executeQuery(deleteVersionsQuery, versionParams);

        // Eliminar el producto de la tabla PRODUCTO
        const deleteProductQuery = `DELETE FROM PRODUCTO WHERE ID_PRODUCTO = :ID_PRODUCTO`;
        const productParams = [id_producto];
        const result = await db.executeQuery(deleteProductQuery, productParams);

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: `Artículo no encontrado con el id ${id_producto}` });
        }

        res.status(200).json({
            message: 'Producto y sus versiones eliminados exitosamente',
            id_producto: id_producto
        });
    } catch (err) {
        console.error('Error al eliminar el producto', err);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

const updateProductById = async (req, res) => {
    const { nombre_producto, descripcion, precio, id_subcategoria, id_descuento, genero, marca } = req.body;
    const { id_producto } = req.params;

    try {
        // Subir nueva imagen si se envía
        let url_imagen = null;
        if (req.file) { // Si el archivo existe
            const result = await cloudinary.uploader.upload(req.file.path);
            url_imagen = result.secure_url; // Obtener la URL segura de la imagen
        }

        const query = `
            UPDATE PRODUCTO
            SET
                NOMBRE_PRODUCTO = :nombre_producto,
                DESCRIPCION = :descripcion,
                PRECIO = :precio,
                ID_SUBCATEGORIA = :id_subcategoria,
                ID_DESCUENTO = :id_descuento,
                GENERO = :genero,
                MARCA = :marca,
                URL_IMAGEN = COALESCE(:url_imagen, URL_IMAGEN) -- Actualizar la imagen solo si hay nueva
            WHERE ID_PRODUCTO = :id_producto      
        `;
        const params = [nombre_producto, descripcion, precio, id_subcategoria, id_descuento, genero, marca, url_imagen, id_producto];
        const result = await db.executeQuery(query, params);

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({
            message: `Producto actualizado exitosamente con el id: ${id_producto}`,
            id_producto,
            nombre_producto,
            descripcion,
            precio,
            id_subcategoria,
            id_descuento,
            genero,
            marca,
            url_imagen
        })
    } catch (err) {
        console.error('Error al actualizar el producto', err);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductsByGender,
    getProductById,
    getProductByName,
    deleteProductById,
    updateProductById
}