const express = require("express");
const cors = require("cors");
const db = require("./db");
const authRouter = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

dev
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
=======
// --- HEALTH CHECKS (Must be top level) ---
console.log('Registering health routes...');

app.get("/health", (req, res) => {
  console.log('Health check called!');
  res.json({ status: "ok", service: "backend" });
});

app.get("/auth/health", (req, res) => {
  console.log('Auth check called!');
  res.json({ status: "ok", service: "backend-auth" });
});
// -----------------------------------------

app.get('/', (req, res) => {
  res.send('API is running');
});

// Mounted routes
app.use('/auth', authRoutes);
app.use('/meetups', meetupRoutes);
app.use('/users', userRoutes);
app.use('/meetups', reviewRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
main
