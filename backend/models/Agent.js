module.exports = (sequelize, DataTypes) => {
  const Agent = sequelize.define("Agent", {
    agentCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true
    },

    agentName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    mobileNo: {
      type: DataTypes.STRING,
      allowNull: false
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false
    },

    agentCnic: {                
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    dateOfEstablishment: {
      type: DataTypes.DATE,
      allowNull: false
    },

    dateOfOpening: {
      type: DataTypes.DATE,
      allowNull: false
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },

    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // Agent.js
branchId: {
  type: DataTypes.INTEGER,
  allowNull: false
},
 city: {
      type: DataTypes.STRING,
      allowNull: false
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
isActive: {
  type: DataTypes.BOOLEAN,
  defaultValue: true
},
commissionSlab: {
  type: DataTypes.STRING,
  allowNull: false
},

  });

  return Agent;
};
