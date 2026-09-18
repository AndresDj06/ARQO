import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const basename = (document.querySelector('meta[name="app-basename"]')?.getAttribute('content') || '/').replace(/\/$/, '');
export const appRoot = basename;

export const api = axios.create({
    baseURL: `${appRoot}/api`,
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
    },
});

let csrfReady: Promise<void> | null = null;

export async function csrfCookie(): Promise<void> {
    if (!csrfReady) {
        csrfReady = axios
            .get(`${appRoot}/sanctum/csrf-cookie`, {
                withCredentials: true,
                withXSRFToken: true,
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            })
            .then(() => undefined)
            .finally(() => {
                csrfReady = null;
            });
    }
    await csrfReady;
}

export function resetCsrfCookie(): Promise<void> {
    csrfReady = null;
    return csrfCookie();
}

const mutatingMethods = new Set(['post', 'put', 'patch', 'delete']);

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    delete config.headers['X-CSRF-TOKEN'];

    const method = config.method?.toLowerCase() ?? '';
    if (mutatingMethods.has(method)) {
        await csrfCookie();
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const config = error.config as InternalAxiosRequestConfig & { _csrfRetry?: boolean };
        if (error.response?.status !== 419 || !config || config._csrfRetry) {
            return Promise.reject(error);
        }

        config._csrfRetry = true;
        await resetCsrfCookie();
        return api.request(config);
    },
);
