import { bcryptHelper } from "../../utils/bcryptHelper";
import type { IUser } from "./auth.interface";
import { pool } from "../../db";

const signupUserIntoDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  if (!["contributor", "maintainer"].includes(role)) {
    throw new Error(
      "Invalid role. Role must be either 'contributor' or 'maintainer'.",
    );
  }

  const hashedPassword = await bcryptHelper.hashPassword(password);

  const result = await pool.query(
    `
     INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4) RETURNING *
    `,
    [name, email, hashedPassword, role],
  );

  delete result.rows[0].password;

  return result.rows[0];
};

export const authService = {
  signupUserIntoDB,
};
