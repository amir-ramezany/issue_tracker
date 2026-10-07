import express from "express";
import routes from "./routes";
import { errorHandler } from "./common/middlewares/errorHandler.middleware";
import { notFoundHandler } from "./common/middlewares/notFound.middleware";

const app = express();

app.use(express.json());
app.use("/api/v1", routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
