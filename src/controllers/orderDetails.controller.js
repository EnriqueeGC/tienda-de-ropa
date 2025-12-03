const db = require('../config/db.js');
const OrderDetails = db.OrderDetails;

exports.createOrderDetails = async (req, res) => {
    const { orderId, productId, quantity, unitPrice } = req.body;
    
    try {
        const newOrderDetail = await OrderDetails.create({
            orderId,
            productId,
            quantity,
            unitPrice
        });
        res.status(201).json({
            message: 'Order detail created successfully',
            orderDetail: newOrderDetail
        });
    } catch (error) {
        console.error('Error creating order detail:', error);
        res.status(500).json({ message: 'Internal server error' });
    };
};