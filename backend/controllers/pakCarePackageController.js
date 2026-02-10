const { PakCarePackage } = require("../models");

//  CREATE (SUPER_ADMIN only)
exports.createPakCarePackage = async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Only SUPER_ADMIN allowed" });
  }

  try {
    const pkg = await PakCarePackage.create(req.body);
    res.status(201).json({ message: "PakCare package created", pkg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  GET ALL (Public)
exports.getAllPakCarePackages = async (req, res) => {
  try {
    const packages = await PakCarePackage.findAll();
    res.json(packages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  GET BY ID (Public)
exports.getPakCarePackageById = async (req, res) => {
  try {
    const pkg = await PakCarePackage.findByPk(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });
    res.json(pkg);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//  UPDATE (SUPER_ADMIN only)
exports.updatePakCarePackage = async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Only SUPER_ADMIN allowed" });
  }

  try {
    const pkg = await PakCarePackage.findByPk(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    await pkg.update(req.body);
    res.json({ message: "PakCare package updated", pkg });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//  DELETE (SUPER_ADMIN only)
exports.deletePakCarePackage = async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Only SUPER_ADMIN allowed" });
  }

  try {
    const pkg = await PakCarePackage.findByPk(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    await pkg.destroy();
    res.json({ message: "PakCare package deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
