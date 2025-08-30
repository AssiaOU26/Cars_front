// client/src/components/AuthPage.js
import React from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api";
import { useTranslation } from "react-i18next";

function AuthPage({ setView }) {
  const { login } = useAuth();
  const { t } = useTranslation();

  const handleLogin = async (e) => {
    e.preventDefault();
    const credentials = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
    try {
      const data = await toast.promise(loginUser(credentials), {
        loading: t("auth.signin"),
        success: t("auth.signin"),
        error: (err) => err.message || "Invalid credentials.",
      });
      if (data.token) {
        login(data.token);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Brand Showcase */}
        <div className="hidden lg:flex flex-col justify-between ios-card p-8">
          {/* Header Section */}
          <div className="space-y-8">
            {/* Logo */}
            <div className="ios-header-brand flex items-center justify-center w-20 h-20">
              <i className="fas fa-car-crash text-white text-3xl"></i>
            </div>

            {/* Brand text */}
            <div className="space-y-6">
              <h1 className="text-5xl font-bold text-theme-text leading-tight">
                {t("brand")}
              </h1>
              <p className="text-xl text-theme-text-secondary leading-relaxed font-medium">
                {t("tagline")}
              </p>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-theme-surface rounded-xl">
              <div className="w-10 h-10 bg-ios-warning/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-bolt text-ios-warning text-lg"></i>
              </div>
              <div>
                <h3 className="text-theme-text font-semibold mb-1">
                  Real-time Operations
                </h3>
                <p className="text-theme-text-secondary text-sm">
                  Advanced monitoring and instant response capabilities
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-theme-surface rounded-xl">
              <div className="w-10 h-10 bg-ios-success/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-shield-alt text-ios-success text-lg"></i>
              </div>
              <div>
                <h3 className="text-theme-text font-semibold mb-1">
                  Enterprise Security
                </h3>
                <p className="text-theme-text-secondary text-sm">
                  Military-grade encryption with role-based access control
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-theme-surface rounded-xl">
              <div className="w-10 h-10 bg-ios-primary/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-analytics text-ios-primary text-lg"></i>
              </div>
              <div>
                <h3 className="text-theme-text font-semibold mb-1">
                  Advanced Analytics
                </h3>
                <p className="text-theme-text-secondary text-sm">
                  AI-powered insights and predictive maintenance
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="ios-card p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="ios-header-brand flex items-center justify-center w-20 h-20 mx-auto">
              <i className="fas fa-user-circle text-white text-3xl"></i>
            </div>
            <h2 className="text-4xl font-bold text-theme-text">
              {t("auth.welcome")}
            </h2>
            <p className="text-theme-text-secondary text-xl font-medium">
              {t("auth.signin_sub")}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-theme-text uppercase tracking-wider">
                {t("auth.email")}
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder={t("auth.email_ph")}
                  required
                  className="ios-input"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <i className="fas fa-envelope text-theme-text-tertiary"></i>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-theme-text uppercase tracking-wider">
                {t("auth.password")}
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder={t("auth.password_ph")}
                  required
                  className="ios-input"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <i className="fas fa-lock text-theme-text-tertiary"></i>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full ios-button ios-button-primary py-4 text-lg"
            >
              <i className="fas fa-sign-in-alt mr-2"></i>
              {t("auth.signin")}
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center pt-4">
            <p className="text-theme-text-secondary">
              {t("auth.no_account")}{" "}
              <button
                type="button"
                onClick={() => setView("register")}
                className="text-ios-primary font-bold hover:text-ios-secondary transition-colors duration-300 focus:outline-none"
              >
                {t("auth.register_here")}
              </button>
            </p>
          </div>

          {/* Demo notice */}
          <div className="text-center pt-4 border-t border-theme-border">
            <p className="text-theme-text-tertiary text-sm font-medium">
              {t("auth.demo")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
