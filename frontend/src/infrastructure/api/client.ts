const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const httpClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error en la petición a la API");
    }

    return data as T;
};
