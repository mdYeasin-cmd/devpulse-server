import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { authRoute } from "./modules/Auth/auth.route";
import sendResponse from "./utils/sendResponse";
import { issueRoute } from "./modules/Issue/issue.route";

const app: Application = express();

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
