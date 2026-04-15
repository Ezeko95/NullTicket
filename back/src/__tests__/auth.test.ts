import { describe, it, expect, vi, beforeEach } from "vitest";
import { register } from "../services/authService.js";
import * as userModel from "../models/User.js";

interface UserModelMock {
    createUser: ReturnType<typeof vi.fn>;
    findUserByEmail: ReturnType<typeof vi.fn>;
}

vi.mock(
    "../models/User.js",
    (): UserModelMock => ({
        createUser: vi.fn(),
        findUserByEmail: vi.fn()
    })
);

describe("Auth Service - Register Unit Tests", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should register a user successfully when data is valid", async () => {
        const mockUser = {
            id: 1,
            email: "new@dev.com",
            createdAt: new Date().toISOString()
        };

        (
            userModel.createUser as unknown as ReturnType<typeof vi.fn>
        ).mockResolvedValue(mockUser);

        const result = await register({
            email: "new@dev.com",
            password: "password123"
        });

        expect(result.created).toBe(true);
        expect(result.user.email).toBe("new@dev.com");
        expect(userModel.createUser).toHaveBeenCalled();
    });

    it("should throw a 409 error if user already exists", async () => {
        (
            userModel.createUser as unknown as ReturnType<typeof vi.fn>
        ).mockRejectedValue(new Error("Duplicate"));
        (
            userModel.findUserByEmail as unknown as ReturnType<typeof vi.fn>
        ).mockResolvedValue({ id: 2, email: "exists@dev.com" });

        await expect(
            register({
                email: "exists@dev.com",
                password: "password123"
            })
        ).rejects.toThrow("User already exists");
    });
});
