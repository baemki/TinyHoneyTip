'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class like extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.like.belongsTo(models.post_container, { foreignKey: 'post_id' });
            models.like.belongsTo(models.User, { foreignKey: 'user_id' });
        }
    }
    like.init(
        {
            user_id: DataTypes.INTEGER,
            post_id: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'like',
        },
    );
    return like;
};
