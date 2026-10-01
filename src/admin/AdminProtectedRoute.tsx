import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { adminCheckSession } from './adminApi';

const AdminProtectedRoute = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');

  useEffect(() => {
    let cancelled = false;
    adminCheckSession().then((authenticated) => {
      if (!cancelled) setStatus(authenticated ? 'authenticated' : 'unauthenticated');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-brand-charcoal-dark flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-gold" size={32} aria-label="Checking session" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
