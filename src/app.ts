import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.middleware";
import logger from "./utils/logger";
import { HTTP_STATUS } from "./constants.ts/http.constants";

const app: Application = express();

// ─── Security Middlewares ─────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5000",
    credentials: true, // allow cookies from frontend
  })
);

// ─── Request Parsing ──────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Request Logging ─────────────────────────────────────────
app.use(
  morgan("dev", {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

// ─── Health Check ─────────────────────────────────────────────
app.get("/api/health", (req: Request, res: Response) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "StayFlow API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes will be added here as we build ────────────────────
// app.use("/api/auth", authRouter);
// app.use("/api/users", userRouter);
// app.use("/api/properties", propertyRouter);

// ─── Global Error Handler (must be last) ──────────────────────
app.use(errorMiddleware);

export default app;