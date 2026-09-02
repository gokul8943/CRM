import dotenv from "dotenv";
import app from "./app";
import { connectDb } from "./config/dbConnection";

dotenv.config();

const port = process.env.PORT || 5000;

connectDb();

app.listen(port, () => {
  console.log(`[server]: Server running at http://localhost:${port}`);
});