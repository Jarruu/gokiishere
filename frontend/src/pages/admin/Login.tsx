import React, { useActionState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, User, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { BrutalistCard } from '../../components/ui/BrutalistCard';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../lib/auth';

const Login: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Login failed' };
      }

      login(data.data.token, data.data.username);
      return { success: true };
    } catch (err: any) {
      return { error: 'Server lagi pusing. Pastikan backend jalan ya!' };
    }
  }, null);

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-6 bg-brand-red/5">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md"
      >
        <BrutalistCard className="p-8 bg-white">
          <div className="mb-8 text-center">
            <Link 
              to="/" 
              className="inline-block mb-4 text-5xl font-black tracking-tighter uppercase hover:scale-105 transition-transform active:scale-95"
            >
              Goki<span className="text-brand-red">is</span>here
            </Link>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Ruang Etmin</h1>
            <p className="font-bold opacity-60">Yang etmin etmin aja</p>
          </div>

          <form action={formAction} className="space-y-6">
            <Input 
              label="Username"
              name="username"
              type="text"
              icon={<User size={18} />}
              placeholder="admin"
              required
            />

            <Input 
              label="Password"
              name="password"
              type="password"
              icon={<Lock size={18} />}
              placeholder="••••••••"
              required
            />

            {state?.error && (
              <div className="p-4 border-2 border-brand-red bg-brand-yellow text-brand-red flex items-center gap-3 font-bold text-sm">
                <AlertCircle size={18} /> {state.error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full py-4 text-lg"
              disabled={isPending}
            >
              {isPending ? 'tunggu bental' : 'macuk'}
            </Button>
          </form>
        </BrutalistCard>
      </motion.div>
    </div>
  );
};

export default Login;
