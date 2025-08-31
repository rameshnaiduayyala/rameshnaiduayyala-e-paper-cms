const express = require("express");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./models");
const paperRoutes = require("./routes/paperRoutes");
const articleRoutes = require("./routes/articleRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/api/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      status: "ok",
      api: "running",
      database: "connected",
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      api: "running",
      database: "disconnected",
      error: error.message,
    });
  }
});

// Routes
app.use("/api/papers", paperRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/users", userRoutes);

// Sync DB & start server
sequelize.sync({ alter: true }).then(() => {
  app.listen(5000, () =>
    console.log("Server running on http://localhost:5000")
  );
});
