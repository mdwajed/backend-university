import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: (path.join(process.cwd()), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
  default_password: process.env.DEFAULT_PASSWORD,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
  access_token_expire_time: process.env.ACCESS_TOKEN_EXPIRE_TIME,
  refresh_token_expire_time: process.env.REFRESH_TOKEN_EXPIRE_TIME,
};
