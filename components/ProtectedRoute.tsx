'use client';

/**
Protected route wrapper component.
Redirects unauthenticated users to login page.
*/
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
        }
    }, [router]);

    if (!isAuthenticated()) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
}
