import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import authRoutes from "./modules/auth/authRoutes"
import userRoutes from "./modules/user/userRoutes";
import contactRoutes from "./modules/conatcts/contact.routes";
import leadRoutes from "./modules/leads/lead.routes";
import dealRoutes from "./modules/deals/deal.routes";
import reportRoutes from './modules/reports/report.routes';
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();


app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/contacts', contactRoutes);
app.use('/api/v1/leads', leadRoutes);
app.use('/api/v1/deals', dealRoutes);
app.use('/api/v1/reports', reportRoutes);


export default app;