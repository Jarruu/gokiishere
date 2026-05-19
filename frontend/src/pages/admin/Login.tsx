import React, { useActionState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Lock, User, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { BrutalistCard } from "../../components/ui/BrutalistCard";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../lib/auth";
import { login as loginApi } from "../../lib/api";

const MarqueeRow: React.FC<{ reverse?: boolean; duration?: number }> = ({
  reverse = false,
  duration = 20,
}) => {
  const content = (
    <div className="flex shrink-0">
      {[...Array(4)].map((_, i) => (
        <span
          key={i}
          className="text-[6vw] font-black tracking-tighter uppercase px-8 flex items-center whitespace-nowrap"
        >
          <span className="text-black/15">GOKI</span>
          <span className="text-brand-red/25">IS</span>
          <span className="text-black/15">HERE</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="flex overflow-hidden py-1 select-none w-full">
      <motion.div
        animate={{
          x: reverse ? ["-50%", "0%"] : ["0%", "-50%"],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex"
      >
        {content}
        {content}
      </motion.div>
    </div>
  );
};

const Login: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const username = formData.get("username") as string;
      const password = formData.get("password") as string;

      try {
        const data = await loginApi({ username, password });
        login(data.data.token, data.data.username);
        return { success: true };
      } catch (err: any) {
        return {
          error:
            err.message || "Server lagi pusing. Pastikan backend jalan ya!",
        };
      }
    },
    null,
  );

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center p-6 relative bg-brand-yellow isolate overflow-hidden">
      {/* Background Container - Improved coverage and infinite marquee */}
      <div className="absolute inset-0 -z-10 pointer-events-none bg-brand-yellow">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] rotate-[-12deg] flex flex-col justify-center">
          {[...Array(15)].map((_, i) => (
            <MarqueeRow
              key={i}
              reverse={i % 2 === 0}
              duration={30 + (i % 5) * 5}
            />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
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
            <h1 className="text-3xl font-black uppercase tracking-tighter">
              Ruang Etmin
            </h1>
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
              {isPending ? "tunggu bental" : "macuk"}
            </Button>
          </form>
        </BrutalistCard>
      </motion.div>
    </div>
  );
};

export default Login;
