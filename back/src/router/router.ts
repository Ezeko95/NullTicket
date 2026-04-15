import { Router } from "express";
import loginRouter from "./login.router.js";

const router = Router();

router.use("/login", loginRouter);

export default router;
