import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import logger from "./utils/logger";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 StayFlow server running on port ${PORT}`);
  logger.info(`📖 Environment: ${process.env.NODE_ENV}`);
  logger.info(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

// ─── Graceful Shutdown ────────────────────────────────────────
process.on("SIGTERM", () => {
  logger.warn("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    logger.warn("Server closed.");
    process.exit(0);
  });
});

process.on("unhandledRejection", (reason: Error) => {
  logger.error(`Unhandled Rejection: ${reason.message}`);
  server.close(() => process.exit(1));
});