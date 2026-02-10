const { DomesticPackage } = require("../models");

// CREATE (SUPER_ADMIN)
exports.createDomesticPackage = async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Only SUPER_ADMIN allowed" });
  }

  try {
    const pkg = await DomesticPackage.create(req.body);
    res.status(201).json({ message: "Domestic package created", pkg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET ALL (Public)
exports.getAllDomesticPackages = async (req, res) => {
  try {
    const packages = await DomesticPackage.findAll();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET BY ID (Public)
exports.getDomesticPackageById = async (req, res) => {
  try {
    const pkg = await DomesticPackage.findByPk(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });
    res.json(pkg);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE (SUPER_ADMIN)
exports.updateDomesticPackage = async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Only SUPER_ADMIN allowed" });
  }

  try {
    const pkg = await DomesticPackage.findByPk(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    await pkg.update(req.body);
    res.json({ message: "Domestic package updated", pkg });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE (SUPER_ADMIN)
exports.deleteDomesticPackage = async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Only SUPER_ADMIN allowed" });
  }

  try {
    const pkg = await DomesticPackage.findByPk(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    await pkg.destroy();
    res.json({ message: "Domestic package deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
