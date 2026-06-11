import { pool } from "../../db";
import { ISSUE_STATUS, ISSUE_TYPE } from "./issue.constant";
import type { IIssue } from "./issue.interface";

const createIssueIntoDB = async (payload: IIssue) => {
  if (payload.description.length < 20) {
    throw new Error("Issue description must be at least 20 characters long.");
  }

  if (!Object.keys(ISSUE_TYPE).includes(payload.type)) {
    throw new Error(
      "Invalid issue type. It should be either 'bug' or 'feature_request'.",
    );
  }

  payload.status = ISSUE_STATUS.open;

  const result = await pool.query(
    `
       INSERT INTO issues(title, description, type, status, reporter_id) VALUES($1,$2,$3,$4,$5) RETURNING *
      `,
    [
      payload.title,
      payload.description,
      payload.type,
      payload.status,
      payload.reporterId,
    ],
  );

  return result.rows[0];
};

export const issueService = {
  createIssueIntoDB,
};
