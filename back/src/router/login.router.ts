import { Router } from "express";
import { loginController } from "../controllers/loginController.ts";

const loginRouter = Router();

loginRouter.post("/", loginController);
export default loginRouter;
