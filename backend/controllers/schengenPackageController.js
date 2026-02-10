const { SchengenPackage } = require("../models");

//  Create Package (SUPER_ADMIN only)
exports.createPackage = async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Only SUPER_ADMIN can create packages" });
  }

  const {
    duration,
    maxStay,
    diamondSingle,
    diamondFamily,
    goldSingle,
    goldFamily,
    notes
  } = req.body;

  try {
    const pkg = await SchengenPackage.create({
      duration,
      maxStay,
      diamondSingle,
      diamondFamily,
      goldSingle,
      goldFamily,
      notes
    });

    res.status(201).json({ message: "Package created successfully", package: pkg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Get all packages (No token required)
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await SchengenPackage.findAll();
    res.json({ packages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Get package by ID (No token required)
exports.getPackageById = async (req, res) => {
  const { id } = req.params;
  try {
    const pkg = await SchengenPackage.findByPk(id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    res.json({ package: pkg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Update package (SUPER_ADMIN only)
exports.updatePackage = async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Only SUPER_ADMIN can update packages" });
  }

  const { id } = req.params;
  try {
    const pkg = await SchengenPackage.findByPk(id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    await pkg.update(req.body);
    res.json({ message: "Package updated successfully", package: pkg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Delete package (SUPER_ADMIN only)
exports.deletePackage = async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Only SUPER_ADMIN can delete packages" });
  }

  const { id } = req.params;
  try {
    const pkg = await SchengenPackage.findByPk(id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    await pkg.destroy();
    res.json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
