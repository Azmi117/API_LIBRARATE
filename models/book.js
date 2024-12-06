'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.belongsTo(models.User, {foreignKey:'upload_by'});
      Book.hasMany(models.Review, {foreignKey: 'book_id'});
    }
  }
  Book.init({
    title: DataTypes.STRING,
    genre: DataTypes.STRING,
    author: DataTypes.STRING,
    pages: DataTypes.STRING,
    sinopsis: DataTypes.STRING,
    photo: DataTypes.STRING,
    upload_by: DataTypes.STRING,
    country: DataTypes.STRING,
    image_3d: DataTypes.STRING,
    image_Title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};