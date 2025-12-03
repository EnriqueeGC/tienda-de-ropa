module.exports = (sequelize, Sequelize) => {
    const Discounts = sequelize.define("Discounts", {
        discountId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        discount_type: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        discount_value: {
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        start_date: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        end_date: {
            type: Sequelize.DATE,
            allowNull: false,   
        }  
    });
  
    return Discounts;
};