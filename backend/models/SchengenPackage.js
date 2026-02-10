module.exports = (sequelize, DataTypes) => {
  const SchengenPackage = sequelize.define("SchengenPackage", {
    duration: {
      type: DataTypes.STRING,
      allowNull: false
    },
    maxStay: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // Diamond plan prices
    diamondSingle: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    diamondFamily: {
      type: DataTypes.FLOAT,
      allowNull: false
    },

    // Gold plan prices
    goldSingle: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    goldFamily: {
      type: DataTypes.FLOAT,
      allowNull: false
    },

    // Optional: Description or additional notes
    notes: {
      type: DataTypes.STRING
    }
  });

  return SchengenPackage;
};
