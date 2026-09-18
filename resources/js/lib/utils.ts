import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function mediaUrl(path?: string | null) {
    if (!path) {
        return '/images/placeholder-project.svg';
    }
    return path;
}

export function whatsappHref(phone: string, projectTitle: string) {
    const text = `Hola, estoy interesado en el proyecto ${projectTitle} y me gustaría recibir más información`;
    return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
}
