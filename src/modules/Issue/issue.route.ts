import { Router } from "express";
import auth from "../../middlewares/auth";

const rounter = Router();

rounter.post("/", auth(), (req, res) => {
  console.log(req.user, "role from auth middleware");
  res.send("Issue created successfully");
});

export const issueRoute = rounter;
