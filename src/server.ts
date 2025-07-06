import mongoose from "mongoose";
import app from "./app.js";
import config from "./app/config/index.js";

async function main(): Promise<void> {
  try {
    await mongoose.connect(config.database_url as string);
    app.listen(config.port, () => {
      console.log(`University app listening on port ${config.port}`);
    });
  } catch (error) {
    console.error(" Failed to connect to the database", error);
  }
}
void main();
