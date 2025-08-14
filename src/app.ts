import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import router from "./app/routes/index.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import notFound from "./middlewares/notFound.js";
const app: Application = express();

// parser
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use("/api/v1", router);

const test = (req: Request, res: Response) => {
  res.send("Welcome from University App !");
};

app.get("/", test);

app.use(notFound);
app.use(globalErrorHandler);
export default app;
