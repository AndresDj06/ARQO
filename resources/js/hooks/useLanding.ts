import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { LandingPayload } from '@/types';

export function useLanding() {
    const [data, setData] = useState<LandingPayload | null>(null);

    useEffect(() => {
        api.get('/public/landing').then((response) => setData(response.data));
    }, []);

    return data;
}
