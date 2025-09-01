const bcrypt = require("bcryptjs");
const User  = require("../models/User");

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await User.create({
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
    });

    console.log("✅ Admin user created:", admin.username);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
  }
}

createAdmin();
