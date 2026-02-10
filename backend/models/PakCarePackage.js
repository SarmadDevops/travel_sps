module.exports = (sequelize, DataTypes) => {
  const PakCarePackage = sequelize.define("PakCarePackage", {
    duration: {
      type: DataTypes.STRING,
      allowNull: false
    },

    singleCare: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    familyCare: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    singleCarePlus: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    familyCarePlus: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return PakCarePackage;
};
