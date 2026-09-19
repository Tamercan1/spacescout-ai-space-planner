import api from "./axios";
import type { TokenResponse } from "../types/auth";

type Access = {
    access: string
}

export async function login(username: string, password: string): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>("/auth/token/", {
        username, password
    });

    return response.data;
}

export async function refreshToken(refresh: string): Promise<Access> {
    const response = await api.post<Access>("/auth/token/refresh/", {
        refresh
    });

    return response.data;
}

export async function register(username: string, password: string) {
    const response = await api.post("/register/", {
        username, password
    })

    response.data;
}