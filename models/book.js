const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    // }
  }
  Book.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: '"Title" cannot be empty. Please enter a valid string.',
          },
        },
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: '"Author" cannot be empty. Please enter a valid string.',
          },
        },
      },
      genre: DataTypes.STRING,
      year: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: {
            msg: 'Year must be a whole number. Please enter a valid integer.',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Book',
    },
  );
  return Book;
};
