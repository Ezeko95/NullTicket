import express from "express";
import { registerController } from "./controllers/authController.js";
import { initializeDB } from "./dataSource.js";
import { loginController } from "./controllers/authController.js";

const app = express();
const port = process.env.PORT ?? "3001";

await initializeDB();
app.use(express.json());

app.get("/", (_req, res) => {
    res.json({
        ok: true,
        service: "api"
    });
});

app.post("/login", loginController);
app.post("/register", registerController);

app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});
