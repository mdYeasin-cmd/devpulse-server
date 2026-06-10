import bcrypt from "bcryptjs";

const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const bcryptHelper = {
  hashPassword,
};
