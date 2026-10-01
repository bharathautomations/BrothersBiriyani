import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Lock } from 'lucide-react';
import { adminLogin } from './adminApi';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setError(null);
    setIsSubmitting(true);

    const result = await adminLogin(password);

    if (result.success) {
      navigate('/admin/bookings', { replace: true });
    } else {
      setError(result.error ?? 'Invalid credentials.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-charcoal-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-brand-charcoal rounded-2xl border border-brand-gold/20 shadow-2xl p-8">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-brand-gold to-brand-orange mx-auto mb-6">
          <Lock className="text-brand-charcoal-dark" size={26} />
        </div>
        <h1 className="text-2xl font-bold font-display text-white text-center mb-1">Staff Login</h1>
        <p className="text-gray-400 text-sm text-center mb-6">Brothers Biriyani Admin Dashboard</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-gray-300 mb-1.5">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-brand-charcoal-dark border border-brand-gold/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
              required
            />
          </div>

          {error && (
            <div className="bg-brand-red/10 border border-brand-red/30 text-brand-red text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 className="animate-spin" size={18} />}
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
