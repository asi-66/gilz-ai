
import React from "react";
import { motion } from "framer-motion";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

interface AuthFormContainerProps {
  formType: "login" | "signup" | "forgotPassword";
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  rememberMe: boolean;
  setRememberMe: (remember: boolean) => void;
  handleLogin: (e: React.FormEvent) => void;
  handleSignup: (e: React.FormEvent) => void;
  setFormType: (formType: "login" | "signup" | "forgotPassword") => void;
  loading?: boolean;
}

export const AuthFormContainer = ({
  formType,
  email,
  setEmail,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  handleLogin,
  handleSignup,
  setFormType,
  loading = false
}: AuthFormContainerProps) => {
  const handleLoginClick = () => setFormType("login");
  const handleSignupClick = () => setFormType("login"); // Redirect to login instead of signup
  const handleForgotPasswordClick = () => setFormType("forgotPassword");

  return (
    <motion.div
      key={formType}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="w-full max-w-md"
    >
      <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-xl p-8 shadow-sm">
        {formType === "login" && (
          <>
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">Sign In</h2>
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
              onSubmit={handleLogin}
              onSignupClick={handleSignupClick}
              onForgotPasswordClick={handleForgotPasswordClick}
              loading={loading}
              isInternalTool={true}
            />
          </>
        )}
        
        {formType === "signup" && (
          <SignupForm
            onSubmit={() => {}} // Empty function as signup is disabled
            onLoginClick={handleLoginClick}
            loading={loading}
          />
        )}
        
        {formType === "forgotPassword" && (
          <ForgotPasswordForm 
            onLoginClick={handleLoginClick}
          />
        )}
      </div>
    </motion.div>
  );
};
