module.exports = (sequelize, DataTypes) => {
  const DomesticPackage = sequelize.define("DomesticPackage", {
    duration: {
      type: DataTypes.STRING,
      allowNull: false
    },

    platinumSingle: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    platinumFamily: {
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
    }
  });

  return DomesticPackage;
};
