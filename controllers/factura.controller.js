const db = require("../config/db");
const PDFDocument = require('pdfkit');
const fs = require('fs');

const createFacturaPDF = async (req, res) => {
    const { id_pedido } = req.params;

    try {
        // Obtener información del pedido
        const queryPedido = `SELECT p.id_pedido, p.fecha_pedido, p.total_pago, u.nombre
                             FROM PEDIDO p
                             JOIN USUARIO u ON p.id_usuario = u.usuarioid
                             WHERE p.id_pedido = :id_pedido`;
        const resultPedido = await db.executeQuery(queryPedido, { id_pedido });

        if (resultPedido.rows.length === 0) {
            return res.status(404).json({ error: "Pedido no encontrado" });
        }

        const pedido = resultPedido.rows[0];

        // Obtener información del pago
        const queryPago = `SELECT metodo_pago, estado_pago, monto_pago, id_transaccion, fecha_pago
                           FROM PAGO
                           WHERE id_pedido = :id_pedido`;
        const resultPago = await db.executeQuery(queryPago, { id_pedido });

        if (resultPago.rows.length === 0) {
            return res.status(404).json({ error: "Pago no encontrado para el pedido especificado" });
        }

        const pago = resultPago.rows[0];

        // Crear el documento PDF
        const doc = new PDFDocument();
        const filename = `factura_${id_pedido}.pdf`;

        // Configurar encabezado de respuesta para descarga
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-Type', 'application/pdf');

        // Generar el PDF
        doc.pipe(res);

        // Encabezado de la factura
        doc.fontSize(20).text("PequeñaWear", { align: 'center' });
        doc.fontSize(12).text("123 Calle Ejemplo, Ciudad", { align: 'center' });
        doc.text("Teléfono: 555-1234 | Email: contacto@pequenawear.com", { align: 'center' });
        doc.moveDown();

        // Información de la factura y cliente
        doc.fontSize(16).text(`Factura para Pedido #${id_pedido}`);
        doc.fontSize(12).text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`);
        doc.moveDown();
        doc.text(`Cliente: ${pedido.NOMBRE}`);
        doc.text(`Fecha del Pedido: ${pedido.FECHA_PEDIDO}`);
        doc.moveDown();

        // Detalles del Pago
        doc.text("Detalles del Pago:");
        doc.text(`Método de Pago: ${pago.METODO_PAGO}`);
        doc.text(`Estado del Pago: ${pago.ESTADO_PAGO}`);
        doc.text(`Monto Total: Q${pago.MONTO_PAGO}`);
        doc.text(`ID de Transacción: ${pago.ID_TRANSACCION}`);
        doc.text(`Fecha de Pago: ${pago.FECHA_PAGO}`);
        doc.moveDown();

        // Total
        doc.fontSize(14).text(`Monto Total: Q${pedido.TOTAL_PAGO}`, { align: 'right' });

        // Finalizar el documento
        doc.end();
    } catch (error) {
        console.error("Error creating factura PDF:", error);
        res.status(500).json({ error: "Error creating factura PDF" });
    }
};

module.exports = {
    createFacturaPDF,
};