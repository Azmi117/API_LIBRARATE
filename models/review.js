'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.User, {foreignKey: 'user_id'});
      Review.belongsTo(models.Book, {foreignKey:'book_id'});
    }
  }
  Review.init({
    user_id: DataTypes.INTEGER,
    book_id: DataTypes.INTEGER,
    comment: DataTypes.STRING,
    rating: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};