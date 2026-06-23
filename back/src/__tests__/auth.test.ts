import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import authService from "../services/authService.js";
import userRepo from "../repositories/userRepo.js";
import { User } from "../models/userModel.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

vi.mock("../repositories/userRepo.js", () => ({
    default: {
        findByEmail: vi.fn(),
        findById: vi.fn(),
        create: vi.fn()
    }
}));

describe("Auth Service - Register Unit Tests", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should register a user successfully when data is valid", async () => {
        const mockUser = {
            id: 1,
            name: "New User",
            role: "user",
            email: "new@dev.com"
        };

        vi.mocked(userRepo.findByEmail).mockResolvedValue(null);
        vi.mocked(userRepo.create).mockResolvedValue(mockUser as User);

        const result = await authService.register({
            name: "New User",
            email: "new@dev.com",
            password: "password123"
        });

        expect(result.created).toBe(true);
        expect(result.user.email).toBe("new@dev.com");
        expect(userRepo.create).toHaveBeenCalled();
    });

    it("should throw a 409 error if user already exists", async () => {
        vi.mocked(userRepo.findByEmail).mockResolvedValue({
            id: 2,
            name: "existing",
            email: "exists@dev.com",
            password: "hash",
            role: "user"
        } as User);

        await expect(
            authService.register({
                name: "Existing User",
                email: "exists@dev.com",
                password: "password123"
            })
        ).rejects.toThrow("User already exists");
    });
});

describe("Auth Middleware", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const makeResponse = (): Response =>
        ({
            locals: {},
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        }) as unknown as Response;

    const makeRequest = (token?: string): Request =>
        ({
            headers: token ? { authorization: `Bearer ${token}` } : {}
        }) as unknown as Request;

    const makeUser = (role: "user" | "admin" = "user") =>
        ({
            id: 1,
            name: "Test User",
            email: "test@dev.com",
            password: "hash",
            role
        }) as User;

    const makeToken = () =>
        jwt.sign(
            {
                id: 1,
                name: "Test User",
                email: "test@dev.com",
                role: "user"
            },
            process.env.JWT_SECRET ?? "secret"
        );

    it("should allow an authenticated user without a required role", async () => {
        const req = makeRequest(makeToken());
        const res = makeResponse();
        const next = vi.fn();
        vi.mocked(userRepo.findById).mockResolvedValue(makeUser());

        await authMiddleware()(req, res, next);

        expect(next).toHaveBeenCalledOnce();
        expect(res.locals.user).toMatchObject({ id: 1, role: "user" });
    });

    it("should reject requests without a token", async () => {
        const req = makeRequest();
        const res = makeResponse();
        const next = vi.fn();

        await authMiddleware()(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it("should allow an admin when admin role is required", async () => {
        const req = makeRequest(makeToken());
        const res = makeResponse();
        const next = vi.fn();
        vi.mocked(userRepo.findById).mockResolvedValue(makeUser("admin"));

        await authMiddleware({ role: "admin" })(req, res, next);

        expect(next).toHaveBeenCalledOnce();
        expect(res.locals.user).toMatchObject({ id: 1, role: "admin" });
    });

    it("should reject a regular user when admin role is required", async () => {
        const req = makeRequest(makeToken());
        const res = makeResponse();
        const next = vi.fn();
        vi.mocked(userRepo.findById).mockResolvedValue(makeUser());

        await authMiddleware({ role: "admin" })(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });
});
