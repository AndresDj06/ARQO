import { useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export default function PageStage({ children }: { children: ReactNode }) {
    const { pathname } = useLocation();

    return (
        <div key={pathname} className="page-stage">
            {children}
        </div>
    );
}
