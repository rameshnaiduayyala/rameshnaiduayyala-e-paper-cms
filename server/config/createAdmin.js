const bcrypt = require("bcryptjs");
const User  = require("../models/User");

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await User.create({
      username: "admin",
      email: "admin@admin.com",
      role: "admin",
      password: hashedPassword,
    });
    // $2b$10$OycqOe6puAH4NbR3eGfdxOgo2iNfxq4g4zGDkMAHSKWm/ZsP8zvTC

    console.log("✅ Admin user created:", admin.username);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
  }
}

createAdmin();
