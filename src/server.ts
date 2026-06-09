import express, { type Request, type Response } from "express";
import config from "./config";

const app = express();
const port = config.port || 5000;

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to DevPulse server." });
});

app.listen(port, () => {
  console.log(`DevPulse server is running at http://localhost:${config.port}`);
});
