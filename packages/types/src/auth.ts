export type AuthUser = {
    id: string;
    name: string;
    email: string;
};

export type SignInRequest = {
    email: string;
    password: string;
};

export type SignInInput = SignInRequest;

export type LoginRequest = SignInRequest;

export type LoginResponse = {
    token: string;
    user: AuthUser;
};
