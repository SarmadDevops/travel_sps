module.exports = (sequelize, DataTypes) => {
  const RestOfWorldPackage = sequelize.define("RestOfWorldPackage", {
    duration: {
      type: DataTypes.STRING,
      allowNull: false
    },
    maxStay: {
      type: DataTypes.STRING,
      allowNull: false
    },
    diamondSingle: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    diamondFamily: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    goldSingle: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    goldFamily: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  return RestOfWorldPackage;
};
