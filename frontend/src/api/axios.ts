import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

export const authApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

api.interceptors.request.use(
    (config) => {
        const access_token = localStorage.getItem("access_token")

        if(access_token) {
            config.headers.Authorization = `Bearer ${access_token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }   
)

// for error 401 unauthorized error - expired token
api.interceptors.response.use(
    (response) => response,

    async (error) => {

        // if expired token, get the original request and retry with new access token
        const originalRequest = error.config;

        if (error.response.status !== 401) {
            return Promise.reject(error);
        }

        if (originalRequest.url.includes("/auth/token/")) {
            return Promise.reject(error);
        }

        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
            return Promise.reject(error);
        }

        // retry the original request with new token
        try {
            const response = await authApi.post<{ access: string }>(
                "/auth/token/refresh/",
                {
                    refresh: refreshToken
                }
            )

            const newAccessToken = response.data.access;

            // set the new access token to localstorage
            localStorage.setItem("access_token", newAccessToken);
            
            // resend the original request
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return api(originalRequest);
        }
        catch (refreshError) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");

            return Promise.reject(refreshError);
        }
    }
)

export default api