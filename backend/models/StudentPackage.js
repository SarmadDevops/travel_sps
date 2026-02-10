module.exports = (sequelize, DataTypes) => {
  const StudentPackage = sequelize.define("StudentPackage", {
    duration: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // Student Plans
    scholar: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    scholarPlus: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    scholarPro: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  });

  return StudentPackage;
};
