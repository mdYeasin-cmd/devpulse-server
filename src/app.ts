import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { authRoute } from "./modules/Auth/auth.route";
import sendResponse from "./utils/sendResponse";
import { issueRoute } from "./modules/Issue/issue.route";
import cors from "cors";

const app: Application = express();
const corsOption = {
  origin: ["http://localhost:5000", "https://devpulse-server-pi.vercel.app"],
};

app.use(cors(corsOption));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Welcome to DevPulse server.",
    data: null,
  });
});

app.use("/api/auth", authRoute);
app.use("/api/issues", issueRoute);

export default app;
