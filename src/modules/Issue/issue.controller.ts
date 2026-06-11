import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { issueService } from "./issue.service";
import type { IIssue } from "./issue.interface";

const createIssue = async (req: Request, res: Response) => {
  try {
    const reporterId = req?.user?.id;
    const issueData: IIssue = {
      ...req.body,
      reporterId,
    };

    const result = await issueService.createIssueIntoDB(issueData);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const issueController = {
  createIssue,
};
