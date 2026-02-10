module.exports = (sequelize, DataTypes) => {
  const Branch = sequelize.define("Branch", {
    name: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },

    branchCode: {
      type: DataTypes.STRING(3),
      allowNull: false,
      unique: true
    },

    branchPhone: DataTypes.STRING,
    branchAddress: DataTypes.STRING,
    branchOfficialEmail: DataTypes.STRING,
    branchDateOfOpening: DataTypes.DATE,

    adminContactNo: DataTypes.STRING,
    adminCnic: DataTypes.STRING,

    // SUPER ADMIN INPUT
    creditTrial: {
      type: DataTypes.FLOAT,
      allowNull: false
    },

    // AUTO MANAGED
    remainingBalance: {
      type: DataTypes.FLOAT,
      allowNull: false
    },

    issuedPolicyAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    isActive: {
  type: DataTypes.BOOLEAN,
  defaultValue: true
},

    commissionSlab: DataTypes.STRING
  });

  return Branch;
};
