const { RestOfWorldPackage } = require("../models");

//  SUPER_ADMIN only create
exports.createPackage = async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Only SUPER_ADMIN can create package" });
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
    const pkg = await RestOfWorldPackage.create({
      duration,
      maxStay,
      diamondSingle,
      diamondFamily,
      goldSingle,
      goldFamily,
      notes
    });

    res.status(201).json({ message: "Package created successfully", pkg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Get all packages (public)
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await RestOfWorldPackage.findAll();
    res.json({ packages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Get by ID (public)
exports.getPackageById = async (req, res) => {
  try {
    const pkg = await RestOfWorldPackage.findByPk(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    res.json({ pkg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  SUPER_ADMIN only update
exports.updatePackage = async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Only SUPER_ADMIN can update package" });
  }

  try {
    const pkg = await RestOfWorldPackage.findByPk(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    await pkg.update(req.body);
    res.json({ message: "Package updated successfully", pkg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  SUPER_ADMIN only delete
exports.deletePackage = async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Only SUPER_ADMIN can delete package" });
  }

  try {
    const pkg = await RestOfWorldPackage.findByPk(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    await pkg.destroy();
    res.json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
