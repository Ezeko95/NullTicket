import express from "express";
import { initializeDB } from "./dataSource.ts";
import { signInController } from "./controllers/authController.js";
import { initializeDatabase } from "./models/database.js";

const app = express();
const port = process.env.PORT || 3001;

await initializeDB();
app.use(express.json());

app.get("/", (_req, res) => {
    res.json({
        ok: true,
        service: "api"
    });
});

app.post("/sign-in", signInController);

await initializeDatabase();

app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});
