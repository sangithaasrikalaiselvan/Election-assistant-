if (process.env.NODE_ENV !== "test" && !process.env.JEST_WORKER_ID) {
  require("@google-cloud/trace-agent").start();
}

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");

const apiRoutes = require("./routes");
const { PORT, ALLOWED_ORIGINS } = require("./config");
const { notFound, errorHandler } = require("./utils/error");
const { sendSuccess } = require("./utils/response");
const logger = require("./utils/logger");

const app = express();

app.disable("x-powered-by");

const allowedOrigins = ALLOWED_ORIGINS.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

const distPath = path.join(__dirname, "dist");

app.get("/health", (req, res) => {
  sendSuccess(
    res,
    { status: "ok", service: "Cloud Run", ai: "Vertex AI (Gemini)" },
    "Health check ok"
  );
});

app.get("/info", (req, res) => {
  sendSuccess(
    res,
    {
      project: "Election Assistant",
      deployment: "Google Cloud Run",
      ai: "Vertex AI (Gemini)",
      services: ["Cloud Run", "Vertex AI", "Cloud Translation API"],
    },
    "Service info"
  );
});

app.get("/debug-dist", (req, res) => {
  const fs = require("fs");
  const distPath = path.join(__dirname, "dist");
  const assetsPath = path.join(distPath, "assets");

  res.json({
    "dist_exists": fs.existsSync(distPath),
    "dist_files": fs.existsSync(distPath) ? fs.readdirSync(distPath) : "dist folder not found",
    "assets_exists": fs.existsSync(assetsPath),
    "assets_files": fs.existsSync(assetsPath) ? fs.readdirSync(assetsPath) : "assets folder not found",
  });
});

app.use("/api", apiRoutes);

app.use(express.static(distPath));

app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API route not found" });
  }

  res.sendFile(path.join(distPath, "index.html"));
});

app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Backend listening on port ${PORT}`);
  });
}

module.exports = app;
