import axios from 'axios';

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

export async function csrfCookie() {
    await axios.get(`${appRoot}/sanctum/csrf-cookie`, {
        withCredentials: true,
        withXSRFToken: true,
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
    });
}

const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (csrf) {
    api.defaults.headers.common['X-CSRF-TOKEN'] = csrf;
}
