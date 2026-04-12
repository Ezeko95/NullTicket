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

    it("Debe registrar un usuario exitosamente cuando los datos son válidos", async () => {
        const mockUser = {
            id: 1,
            email: "nueva@dev.com",
            createdAt: new Date().toISOString()
        };

        (
            userModel.createUser as unknown as ReturnType<typeof vi.fn>
        ).mockResolvedValue(mockUser);

        const result = await register({
            email: "nueva@dev.com",
            password: "password123"
        });

        expect(result.created).toBe(true);
        expect(result.user.email).toBe("nueva@dev.com");
        expect(userModel.createUser).toHaveBeenCalled();
    });

    it("Debe lanzar un error 409 si el usuario ya existe", async () => {
        (
            userModel.createUser as unknown as ReturnType<typeof vi.fn>
        ).mockRejectedValue(new Error("Duplicate"));
        (
            userModel.findUserByEmail as unknown as ReturnType<typeof vi.fn>
        ).mockResolvedValue({ id: 2, email: "existe@dev.com" });

        await expect(
            register({
                email: "existe@dev.com",
                password: "password123"
            })
        ).rejects.toThrow("User already exists");
    });
});
