const express = require("express");
const cors = require("cors");
const db = require("./db");
const authRouter = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

// Global health
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Auth-routes
app.use("/auth", authRouter);

const port = process.env.PORT || 3000;

async function start() {
  try {
    await db.init();
    app.listen(port, () => {
      console.log(`API running on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    // Vi vill inte döda processen direkt i Render om DB failar tillfälligt, men 
    // här följer jag instruktionen. Render startar om containern vid exit(1).
    process.exit(1);
  }
}

start();
