import jwt from "jsonwebtoken";

interface JwtPayload {
  id: number;
  name: string;
  role: string;
}

const generateJwtAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, "your_secret_key", { expiresIn: "1h" });
};

export const jwtHelper = {
  generateJwtAccessToken,
};
