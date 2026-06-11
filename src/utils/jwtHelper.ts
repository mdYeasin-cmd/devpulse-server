import jwt from "jsonwebtoken";
import config from "../config";

interface JwtPayload {
  id: number;
  name: string;
  role: string;
}

const generateJwtAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, config.jwt_secret_key as string, {
    expiresIn: "7d",
  });
};

const verifyJwtToken = (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      config.jwt_secret_key as string,
    ) as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid token!");
  }
};

export const jwtHelper = {
  generateJwtAccessToken,
  verifyJwtToken,
};
