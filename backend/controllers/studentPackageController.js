const { StudentPackage } = require("../models");

// CREATE
exports.createStudentPackage = async (req, res) => {
  const { duration, scholar, scholarPlus, scholarPro, notes } = req.body;

  try {
    const pkg = await StudentPackage.create({
      duration,
      scholar,
      scholarPlus,
      scholarPro
    });

    res.status(201).json({
      message: "Student package created successfully",
      package: pkg
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET ALL
exports.getAllStudentPackages = async (req, res) => {
  try {
    const packages = await StudentPackage.findAll();
    res.json({ packages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET BY ID
exports.getStudentPackageById = async (req, res) => {
  try {
    const pkg = await StudentPackage.findByPk(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: "Student package not found" });
    }

    res.json({ package: pkg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE
exports.updateStudentPackage = async (req, res) => {
  try {
    const pkg = await StudentPackage.findByPk(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: "Student package not found" });
    }

    await pkg.update(req.body);
    res.json({
      message: "Student package updated successfully",
      package: pkg
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE
exports.deleteStudentPackage = async (req, res) => {
  try {
    const pkg = await StudentPackage.findByPk(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: "Student package not found" });
    }

    await pkg.destroy();
    res.json({ message: "Student package deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
