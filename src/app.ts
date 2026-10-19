import express from "express";
import userRoutes from "./routes/userRoutes";
import sessionRoutes from "./routes/sessionRoutes";
import { errorHandler, notFound } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

app.use("/users", userRoutes);
app.use("/sessions", sessionRoutes);

app.use(notFound);
app.use(errorHandler); // always last

export default app;