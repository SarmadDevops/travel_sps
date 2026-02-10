require("dotenv").config();
const bcrypt = require("bcrypt");
const { User, sequelize } = require("../models");

(async () => {
  try {
    await sequelize.authenticate();

    const exists = await User.findOne({
      where: { role: "SUPER_ADMIN" }
    });

    if (exists) {
      console.log("Super Admin already exists");
      process.exit();
    }

    await User.create({
      name: "Super Admin",
      email: "superadmin@united.com",
      password: await bcrypt.hash("Admin@123", 10),
      role: "SUPER_ADMIN",
      isActive: true
    });

    console.log("Super Admin created successfully");
    process.exit();
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
})();
