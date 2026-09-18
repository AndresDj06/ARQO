import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PageStage from '@/components/PageStage';

/** Al cambiar de pestaña vuelve arriba; con ancla, busca la sección aunque los datos tarden. */
function ScrollManager() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (!hash) {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
            return;
        }

        let attempts = 0;
        const findTarget = () => {
            const target = document.querySelector(hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }
            if (attempts < 12) {
                attempts += 1;
                window.setTimeout(findTarget, 120);
            }
        };

        findTarget();
    }, [pathname, hash]);

    return null;
}

export default function PublicLayout() {
    return (
        <>
            <ScrollManager />
            <PageStage>
                <Outlet />
            </PageStage>
        </>
    );
}
