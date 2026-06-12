import { pool } from "../../db";
import { USER_ROLE } from "../../types";
import type { IUser } from "../Auth/auth.interface";
import { ISSUE_STATUS, ISSUE_TYPE } from "./issue.constant";
import type { IIssue, IIssueQuery } from "./issue.interface";

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

const getAllIssuesFromDB = async (query: IIssueQuery) => {
  let baseQuery = `SELECT * FROM issues`;

  const conditions = [];
  const values = [];

  if (query?.type) {
    conditions.push(`type = $${values.length + 1}`);
    values.push(query.type);
  }

  if (query?.status) {
    conditions.push(`status = $${values.length + 1}`);
    values.push(query.status);
  }

  if (conditions.length) {
    baseQuery += ` WHERE ${conditions.join(" AND ")}`;
  }

  const sort = query?.sort ?? "newest";
  const orderBy = sort === "oldest" ? "ASC" : "DESC";

  baseQuery += ` ORDER BY created_at ${orderBy}`;

  console.log(baseQuery, "base query for issues");

  const result = await pool.query(baseQuery, values);

  const issues = result.rows;

  const issuesWithReporterInfo = issues.map(async (issue) => {
    const reporterId = issue.reporter_id;

    const reporterInfo = await pool.query(
      `SELECT id, name, role FROM users WHERE id = $1`,
      [reporterId],
    );

    issue.reporter = reporterInfo.rows[0];

    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter: issue.reporter,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    };
  });

  const results = await Promise.all(issuesWithReporterInfo);

  return results;
};

const getSingleIssueFromDB = async (id: string) => {
  const result = await pool.query(`SELECT * FROM issues WHERE id = $1`, [id]);

  const issue = result.rows[0];

  const reporterId = issue?.reporter_id;

  const reporterInfo = await pool.query(
    `SELECT id, name, role FROM users WHERE id = $1`,
    [reporterId],
  );

  const formatedIssue = {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: reporterInfo.rows[0],
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };

  return formatedIssue;
};

const updateAIssueInDB = async (
  id: string,
  user: IUser,
  payload: Partial<IIssue>,
) => {
  const isIssueExist = await pool.query(`SELECT * FROM issues WHERE id = $1`, [
    id,
  ]);

  if (!isIssueExist.rows.length) {
    throw new Error("Issue not found");
  }

  const issue = isIssueExist.rows[0];

  const isContributor = user.role === USER_ROLE.contributor;

  if (isContributor) {
    if (issue.reporter_id !== user.id) {
      throw new Error("You are not authorized to update this issue");
    }

    if (payload.status !== undefined) {
      throw new Error("Only maintainers can update issue status");
    }

    if (issue.status !== ISSUE_STATUS.open) {
      throw new Error("Only issues with 'open' status can be updated");
    }
  }

  if (payload.type && !Object.keys(ISSUE_TYPE).includes(payload.type)) {
    throw new Error(
      "Invalid issue type. It should be either 'bug' or 'feature_request'.",
    );
  }

  if (payload.status && !Object.keys(ISSUE_STATUS).includes(payload.status)) {
    throw new Error(
      "Invalid issue status. It should be either 'open', 'in_progress' or 'resolved'.",
    );
  }

  const result = await pool.query(
    `
    UPDATE issues 
    SET 
    title=COALESCE($1,title),
    description=COALESCE($2,description),
    type=COALESCE($3,type),
    status=COALESCE($4,status)

    WHERE id=$5 RETURNING *
    `,
    [
      payload.title,
      payload.description,
      payload.type,
      payload.status,
      issue.id,
    ],
  );

  return result.rows[0];
};

const deleteAIssueFromDB = async (id: string) => {
  const isIssueExist = await pool.query(`SELECT * FROM issues WHERE id = $1`, [
    id,
  ]);

  if (!isIssueExist.rows.length) {
    throw new Error("Issue not found");
  }

  await pool.query(`DELETE FROM issues WHERE id = $1`, [id]);
};

export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateAIssueInDB,
  deleteAIssueFromDB,
};
