import express from "express";
import { registerController } from "./controllers/authController.js";
import { eventsController } from "./controllers/eventsController.js";
import { initializeDB } from "./dataSource.js";
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

app.post("/register", registerController);
app.get("/events", eventsController);

await initializeDatabase();

app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});
