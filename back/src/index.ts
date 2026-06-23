import "reflect-metadata";
import express from "express";
import morgan from "morgan";
import {
    registerController,
    loginController
} from "./controllers/authController.js";
import {
    createEventController,
    deleteEventController,
    eventByIdController,
    eventsController,
    patchEventController
} from "./controllers/eventsController.js";
import {
    deleteUserTicketController,
    getUserTicketsController,
    purchaseUserTicketController
} from "./controllers/ticketController.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import { initializeDB } from "./dataSource.js";
import { ErrorHandlerMiddleware } from "./middleware/errorHandlerMiddleware.js";

const app = express();
const port = process.env.PORT ?? "3001";

await initializeDB();
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (_req, res) => {
    res.json({
        ok: true,
        service: "api"
    });
});

app.post("/login", loginController);
app.post("/register", registerController);
app.get("/events", eventsController);
app.get("/events/:eventId", eventByIdController);

// ADMIN
app.post("/events", authMiddleware({ role: "admin" }), createEventController);
app.patch(
    "/events/:eventId",
    authMiddleware({ role: "admin" }),
    patchEventController
);
app.delete(
    "/events/:eventId",
    authMiddleware({ role: "admin" }),
    deleteEventController
);

app.get("/me/tickets", authMiddleware(), getUserTicketsController);
app.post("/me/tickets", authMiddleware(), purchaseUserTicketController);
app.delete(
    "/me/tickets/:ticketId",
    authMiddleware(),
    deleteUserTicketController
);

app.use(ErrorHandlerMiddleware);

app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});
