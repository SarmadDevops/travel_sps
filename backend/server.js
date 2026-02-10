require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const { sequelize } = require("./models");
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/branch", require("./routes/branchRoutes"));
app.use("/api/agents", require("./routes/agentRoutes"));
app.use("/api/schengen", require("./routes/schengenPackageRoutes"));
app.use("/api/rest-of-world-packages", require("./routes/restOfWorldRoutes"));
app.use("/api/world-wide-packages", require("./routes/worldWideRoutes"));
app.use("/api/domestic-packages", require("./routes/domesticPackageRoutes"));
app.use("/api/pakcare", require("./routes/pakCarePackageRoutes"));
app.use("/api/student-packages", require("./routes/StudentPackageRoutes"));
app.use("/api/under-writing", require("./routes/underWritingRoutes"));

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log("MySQL connected successfully");

    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("DB connection failed:", err);
  });
