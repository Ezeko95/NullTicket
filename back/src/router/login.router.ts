import { Router } from "express";
import { loginController } from "../controllers/loginController.js";

const loginRouter = Router();

loginRouter.post("/", loginController);
export default loginRouter;
