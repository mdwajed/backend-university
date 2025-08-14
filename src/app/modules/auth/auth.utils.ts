import jwt, { SignOptions } from "jsonwebtoken";

type JWTPayload = {
  userId: string;
  role: string;
};

export const tokenGeneration = (
  payload: JWTPayload,
  secret: string,
  expiresIn: SignOptions["expiresIn"]
): string => {
  return jwt.sign(payload, secret, { expiresIn });
};
