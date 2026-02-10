module.exports = (sequelize, DataTypes) => {
  const WorldWidePackage = sequelize.define("WorldWidePackage", {
    duration: {
      type: DataTypes.STRING,
      allowNull: false
    },

    maxStay: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // 🟣 Platinum
    platinumSingle: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    platinumFamily: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    // 🟡 Gold Plus
    goldPlusSingle: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    goldPlusFamily: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    // ⚫ Titanium
    titaniumSingle: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    titaniumFamily: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    notes: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  return WorldWidePackage;
};
