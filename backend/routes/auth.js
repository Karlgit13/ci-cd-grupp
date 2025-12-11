const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

// Health för /auth
router.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// Enkel register-endpoint
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await db.query(
            `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at
    `,
            [username, email, passwordHash]
        );

        res.status(201).json({
            message: "User created",
            user: result.rows[0]
        });
    } catch (err) {
        console.error("Error in /auth/register:", err);

        if (err.code === "23505") {
            // unique_violation
            return res.status(409).json({ message: "Username or email already exists" });
        }

        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
