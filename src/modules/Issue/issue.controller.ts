import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { issueService } from "./issue.service";
import type { IIssue } from "./issue.interface";
import type { IUser } from "../Auth/auth.interface";
import { StatusCodes } from "http-status-codes";

const createIssue = async (req: Request, res: Response) => {
  try {
    const reporterId = req?.user?.id;
    const issueData: IIssue = {
      ...req.body,
      reporterId,
    };

    const result = await issueService.createIssueIntoDB(issueData);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getAllIssuesFromDB();

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Issues retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await issueService.getSingleIssueFromDB(id as string);

    if (!result) {
      return sendResponse(res, {
        statusCode: StatusCodes.NOT_FOUND,
        success: false,
        message: "Issue not found",
      });
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Issue retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const updateAIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const user = req?.user;

    const result = await issueService.updateAIssueInDB(
      id as string,
      user as IUser,
      payload,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const deleteAIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await issueService.deleteAIssueFromDB(id as string);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error: any) {
    console.log(error);
    sendResponse(res, {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateAIssue,
  deleteAIssue,
};
