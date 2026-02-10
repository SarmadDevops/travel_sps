

const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/database");

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging
  }
);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require("./User")(sequelize, DataTypes);
db.Branch = require("./Branch")(sequelize, DataTypes);
db.Agent = require("./Agent")(sequelize, DataTypes);
db.SchengenPackage = require("./SchengenPackage")(sequelize, DataTypes);
db.RestOfWorldPackage = require("./RestOfWorldPackage")(sequelize, DataTypes);
db.WorldWidePackage = require("./WorldWidePackage")(sequelize, DataTypes);
db.DomesticPackage = require("./DomesticPackage")(sequelize, DataTypes);
db.PakCarePackage = require("./PakCarePackage")(sequelize, DataTypes);
db.StudentPackage = require("./StudentPackage")(sequelize, DataTypes);
db.UnderWritingPolicy = require("./UnderWritingPolicy")(sequelize, DataTypes);

// Branch ↔ User
db.Branch.hasMany(db.User, { foreignKey: "branchId" });
db.User.belongsTo(db.Branch, { foreignKey: "branchId" });

// Branch ↔ Agent ✅ ADD THIS
db.Branch.hasMany(db.Agent, { foreignKey: "branchId" });
db.Agent.belongsTo(db.Branch, { foreignKey: "branchId" });

// Admin ↔ Agent
db.User.hasMany(db.Agent, { foreignKey: "adminId" });
db.Agent.belongsTo(db.User, { foreignKey: "adminId" });

// Relations
db.Branch.hasMany(db.UnderWritingPolicy, { foreignKey: "branchId" });
db.UnderWritingPolicy.belongsTo(db.Branch, { foreignKey: "branchId" });

db.User.hasMany(db.UnderWritingPolicy, { foreignKey: "adminId" });
db.UnderWritingPolicy.belongsTo(db.User, { foreignKey: "adminId" });

db.Agent.hasMany(db.UnderWritingPolicy, { foreignKey: "agentId" });
db.UnderWritingPolicy.belongsTo(db.Agent, { foreignKey: "agentId" });



module.exports = db;
