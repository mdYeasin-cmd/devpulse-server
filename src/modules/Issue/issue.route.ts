import { Router } from "express";
import auth from "../../middlewares/auth";
import { issueController } from "./issue.controller";
import { USER_ROLE } from "../../types";

const rounter = Router();

rounter.post(
  "/",
  auth(USER_ROLE.maintainer, USER_ROLE.contributor),
  issueController.createIssue,
);

rounter.get("/", issueController.getAllIssues);

rounter.get("/:id", issueController.getSingleIssue);

rounter.patch(
  "/:id",
  auth(USER_ROLE.maintainer, USER_ROLE.contributor),
  issueController.updateAIssue,
);

rounter.delete(
  "/:id",
  auth(USER_ROLE.maintainer),
  issueController.deleteAIssue,
);

export const issueRoute = rounter;
