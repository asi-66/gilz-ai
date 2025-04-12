
import React from "react";
import { motion } from "framer-motion";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

interface AuthFormContainerProps {
  showLoginForm: boolean;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  rememberMe: boolean;
  setRememberMe: (remember: boolean) => void;
  handleLogin: (e: React.FormEvent) => void;
  handleSignup: (e: React.FormEvent) => void;
  handleLoginClick: () => void;
  handleSignupClick: () => void;
}

export const AuthFormContainer = ({
  showLoginForm,
  email,
  setEmail,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  handleLogin,
  handleSignup,
  handleLoginClick,
  handleSignupClick
}: AuthFormContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="w-full md:w-1/2 max-w-sm"
    >
      <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-xl p-6 shadow-sm">
        {showLoginForm ? (
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            onSubmit={handleLogin}
            onSignupClick={handleSignupClick}
          />
        ) : (
          <SignupForm
            onSubmit={handleSignup}
            onLoginClick={handleLoginClick}
          />
        )}
      </div>
    </motion.div>
  );
};
