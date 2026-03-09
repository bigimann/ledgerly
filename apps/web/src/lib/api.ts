import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Create axios instance
export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // Try to refresh the token
        const response = await axios.post(`${API_URL}/api/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data.data;

        // Save new access token
        localStorage.setItem("accessToken", accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// AUTH API

export const authApi = {
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  logout: async (refreshToken: string) => {
    const response = await api.post("/auth/logout", { refreshToken });
    return response.data;
  },

  me: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// TRANSACTIONS API

export const transactionsApi = {
  create: async (data: any) => {
    const response = await api.post("/transactions", data);
    return response.data;
  },

  getAll: async (filters?: {
    type?: string;
    startDate?: string;
    endDate?: string;
    category?: string;
  }) => {
    const response = await api.get("/transactions", { params: filters });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.patch(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  getDeleted: async () => {
    const response = await api.get("/transactions/deleted");
    return response.data;
  },

  getMonthlySummary: async (year: number, month: number) => {
    const response = await api.get(
      `/transactions/summary/month/${year}/${month}`
    );
    return response.data;
  },

  getCalendar: async (year: number, month: number) => {
    const response = await api.get(`/transactions/calendar/${year}/${month}`);
    return response.data;
  },
};

// REPORTS API

export const reportsApi = {
  getMonthly: async (year: number, month: number) => {
    const response = await api.get(`/reports/monthly/${year}/${month}`);
    return response.data;
  },

  getAnnual: async (year: number) => {
    const response = await api.get(`/reports/annual/${year}`);
    return response.data;
  },

  getTax: async (year: number, rent?: number) => {
    const params = rent ? { rent } : {};
    const response = await api.get(`/reports/tax/${year}`, { params });
    return response.data;
  },

  getYTD: async () => {
    const response = await api.get("/reports/ytd");
    return response.data;
  },
};
