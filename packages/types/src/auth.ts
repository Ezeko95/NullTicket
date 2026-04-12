export type AuthUser = {
    id: string;
    name: string;
    email: string;
};

export type RegisterRequest = {
    email: string;
    password: string;
};

export type LoginRequest = RegisterRequest;

export type LoginResponse = {
    token: string;
    user: AuthUser;
};
