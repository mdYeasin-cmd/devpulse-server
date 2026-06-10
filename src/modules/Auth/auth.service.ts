import { bcryptHelper } from "../../utils/bcryptHelper";
import type { IUser } from "./auth.interface";

const signupUserIntoDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  if (!["contributor", "maintainer"].includes(role)) {
    throw new Error(
      "Invalid role. Role must be either 'contributor' or 'maintainer'.",
    );
  }

  const hashedPassword = await bcryptHelper.hashPassword(password);

  return {
    name,
    email,
    password: hashedPassword,
    role,
  };
};

export const authService = {
  signupUserIntoDB,
};
