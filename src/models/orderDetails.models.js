module.exports = (sequelize, Sequelize) => {
    const OrderDetails = sequelize.define("OrderDetails", {
        orderDetailId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        orderId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        productId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        unitPrice: {
            type: Sequelize.FLOAT,
            allowNull: false,
        }
    });
  
    return OrderDetails;
}