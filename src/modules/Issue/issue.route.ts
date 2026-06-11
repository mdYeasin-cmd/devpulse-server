import { Router } from "express";
import auth from "../../middlewares/auth";
import { issueController } from "./issue.controller";

const rounter = Router();

rounter.post(
  "/",
  auth("maintainer", "contributor"),
  issueController.createIssue,
);

rounter.get("/", issueController.getAllIssues);

export const issueRoute = rounter;
