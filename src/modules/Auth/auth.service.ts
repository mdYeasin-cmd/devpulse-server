import { bcryptHelper } from "../../utils/bcryptHelper";
import type { IUser } from "./auth.interface";
import { pool } from "../../db";
import { jwtHelper } from "../../utils/jwtHelper";

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

const loginUserIntoDB = async (payload: Pick<IUser, "email" | "password">) => {
  const { email, password } = payload;

  const result = await pool.query(
    `
     SELECT * FROM users WHERE email = $1
    `,
    [email],
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid credentials!");
  }

  const user = result.rows[0];

  const isMatched = await bcryptHelper.comparePassword(password, user.password);

  if (!isMatched) {
    throw new Error("Invalid credentials!");
  }

  const jwtpayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };

  const accessToken = jwtHelper.generateJwtAccessToken(jwtpayload);

  delete user.password;

  return {
    token: accessToken,
    user,
  };
};

export const authService = {
  signupUserIntoDB,
  loginUserIntoDB,
};
