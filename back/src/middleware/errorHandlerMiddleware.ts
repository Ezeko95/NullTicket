import { NextFunction, Request, Response } from "express";

/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }]*/

export const ErrorHandlerMiddleware = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.error(`[ERROR] ${err.message}`);
    if (err.stack) console.error(err.stack);
    res.status(500).json({ ok: false, error: "Internal server error." });
};
