const db = require("../config/db");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const axios = require('axios');

const logoUrl = 'https://res.cloudinary.com/dy3j25cis/image/upload/v1730358883/t46lsrv5fd0phfsbafou.png';

const createFacturaPDF = async (req, res) => {
    const { id_pedido } = req.params;
    try {
        const queryPedido = `SELECT p.id_pedido, p.fecha_pedido, p.total_pago, u.nombre 
                             FROM PEDIDO p JOIN USUARIO u ON p.id_usuario = u.usuarioid
                             WHERE p.id_pedido = :id_pedido`;
        const resultPedido = await db.executeQuery(queryPedido, { id_pedido });
        
        if (resultPedido.rows.length === 0) {
            return res.status(404).json({ error: "Pedido no encontrado" });
        }
        const pedido = resultPedido.rows[0];

        const queryPago = `SELECT metodo_pago, estado_pago, monto_pago, id_transaccion, fecha_pago 
                           FROM PAGO WHERE id_pedido = :id_pedido`;
        const resultPago = await db.executeQuery(queryPago, { id_pedido });

        if (resultPago.rows.length === 0) {
            return res.status(404).json({ error: "Pago no encontrado para el pedido especificado" });
        }
        const pago = resultPago.rows[0];

        const queryDetalles = `SELECT d.id_producto, d.cantidad, d.precio_unitario, pr.nombre_producto 
                               FROM DETALLEPEDIDO d JOIN PRODUCTO pr ON d.id_producto = pr.id_producto 
                               WHERE d.id_pedido = :id_pedido`;
        const resultDetalles = await db.executeQuery(queryDetalles, { id_pedido });
        const detalles = resultDetalles.rows;

        const logoUrl = 'https://res.cloudinary.com/dy3j25cis/image/upload/v1730358883/t46lsrv5fd0phfsbafou.png';
        const response = await axios.get(logoUrl, { responseType: 'arraybuffer' });
        const logo = Buffer.from(response.data, 'binary');

        const doc = new PDFDocument({ margin: 50 });
        const filename = `factura_${id_pedido}.pdf`;

        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);

        // Encabezado de la Empresa
        doc.image(logo, 50, 45, { width: 50 })
           .fontSize(20).text("PequeñaWear", 110, 57)
           .fontSize(10).text("123 Calle Ejemplo, Ciudad", { align: 'right' })
           .text("Teléfono: 555-1234 | Email: contacto@pequenawear.com", { align: 'right' })
           .moveDown();

        // Información de la Factura y Cliente
        doc.fontSize(14).text(`Factura para Pedido #${id_pedido}`, { underline: true });
        doc.fontSize(12).text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`);
        doc.text(`Cliente: ${pedido.NOMBRE}`);
        doc.text(`Fecha del Pedido: ${new Date(pedido.FECHA_PEDIDO).toLocaleDateString()}`)
           .moveDown();

        // Detalles del Pago
        doc.text("Detalles del Pago:", { underline: true });
        doc.text(`Método de Pago: ${pago.METODO_PAGO}`);
        doc.text(`Estado del Pago: ${pago.ESTADO_PAGO}`);
        doc.text(`ID de Transacción: ${pago.ID_TRANSACCION}`);
        doc.text(`Fecha de Pago: ${new Date(pago.FECHA_PAGO).toLocaleDateString()}`);
        doc.moveDown();

        // Tabla de Productos
        doc.fontSize(12).text("Detalles de Productos:", { underline: true });
        doc.moveDown();

        // Encabezado de la tabla
        const tableTop = doc.y;
        doc.fontSize(10)
           .text("Producto", 50, tableTop, { bold: true })
           .text("Cantidad", 250, tableTop, { bold: true })
           .text("Precio Unitario", 330, tableTop, { bold: true })
           .text("Total", 430, tableTop, { bold: true });

        let currentY = tableTop + 15;
        detalles.forEach(item => {
            const totalItem = item.CANTIDAD * item.PRECIO_UNITARIO;
            doc.text(item.NOMBRE_PRODUCTO, 50, currentY)
               .text(item.CANTIDAD, 250, currentY)
               .text(`Q${item.PRECIO_UNITARIO.toFixed(2)}`, 330, currentY)
               .text(`Q${totalItem.toFixed(2)}`, 430, currentY);
            currentY += 20;

            // Añade líneas para una apariencia de tabla
            doc.moveTo(50, currentY - 5)
               .lineTo(500, currentY - 5)
               .strokeColor('#aaaaaa')
               .stroke();
        });

        // Total Final
        doc.moveDown()
           .fontSize(12)
           .text(`Monto Total: Q${pedido.TOTAL_PAGO.toFixed(2)}`, 430, currentY + 10, { bold: true });

        // Finalizar el documento PDF
        doc.end();
    } catch (error) {
        console.error("Error creando la factura en PDF:", error);
        res.status(500).json({ error: "Error creando la factura en PDF" });
    }
};

module.exports = {
    createFacturaPDF,
};
