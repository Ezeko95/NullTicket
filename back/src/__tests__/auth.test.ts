import { describe, it, expect, vi, beforeEach } from "vitest";
import authService from "../services/authService.js";
import userRepo from "../repositories/userRepo.js";
import { User } from "../models/userModel.js";

vi.mock("../repositories/userRepo.js", () => ({
    default: {
        findByEmail: vi.fn(),
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
            email: "new@dev.com"
        };

        vi.mocked(userRepo.findByEmail).mockResolvedValue(null);
        vi.mocked(userRepo.create).mockResolvedValue(mockUser as User);

        const result = await authService.register({
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
            password: "hash"
        } as User);

        await expect(
            authService.register({
                email: "exists@dev.com",
                password: "password123"
            })
        ).rejects.toThrow("User already exists");
    });
});
