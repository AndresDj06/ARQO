import { Outlet } from 'react-router-dom';
import PageStage from '@/components/PageStage';

export default function PublicLayout() {
    return (
        <PageStage>
            <Outlet />
        </PageStage>
    );
}
