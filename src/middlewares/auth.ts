import type { NextFunction, Request, Response } from "express";
import { type JwtPayload } from "jsonwebtoken";
import { pool } from "../db";
import type { ROLES } from "../types";
import { jwtHelper } from "../utils/jwtHelper";

const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        res.status(401).json({
          success: false,
          message: "Unauthorized access!!",
        });
      }

      const decoded: JwtPayload = jwtHelper.verifyJwtToken(token as string);

      const userData = await pool.query(
        `
       SELECT * FROM users WHERE id=$1
          `,
        [decoded.id],
      );

      if (userData.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: "User not found!",
        });
      }

      const user = userData.rows[0];

      if (roles.length && !roles.includes(user.role)) {
        res.status(403).json({
          success: false,
          message: "Forbidden!!,This role have no access!",
        });
      }

      req.user = decoded;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
