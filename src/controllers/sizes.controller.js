const db = require('../config/db.js')
const Size = db.Sizes;

exports.getAllSizes = async (req, res) => {
    try {
        const sizes = await Size.findAll();

        if (sizes.length === 0) {
            return res.status(404).json({ message: 'No sizes found' });
        }

        res.status(200).json({
            message: 'Sizes retrieved successfully',
            sizes: sizes
        });
    } catch (error) {
        console.error('Error retrieving sizes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
