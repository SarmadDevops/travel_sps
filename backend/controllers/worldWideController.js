const { WorldWidePackage } = require("../models");

//  SUPER_ADMIN → Create
exports.createPackage = async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Only SUPER_ADMIN can create package" });
  }

  try {
    const pkg = await WorldWidePackage.create(req.body);
    res.status(201).json({ message: "World Wide package created", pkg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Public → Get All
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await WorldWidePackage.findAll();
    res.json({ packages });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Public → Get By ID
exports.getPackageById = async (req, res) => {
  try {
    const pkg = await WorldWidePackage.findByPk(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    res.json({ pkg });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//  SUPER_ADMIN → Update
exports.updatePackage = async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Only SUPER_ADMIN can update package" });
  }

  try {
    const pkg = await WorldWidePackage.findByPk(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    await pkg.update(req.body);
    res.json({ message: "Package updated", pkg });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//  SUPER_ADMIN → Delete
exports.deletePackage = async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Only SUPER_ADMIN can delete package" });
  }

  try {
    const pkg = await WorldWidePackage.findByPk(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    await pkg.destroy();
    res.json({ message: "Package deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
