// client/src/components/RegisterPage.js
import React from "react";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
import { registerUser } from "../api";
import { useTranslation } from "react-i18next";

function RegisterPage({ setView }) {
  const { themeConfig, isDark } = useTheme();
  const { t } = useTranslation();

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const credentials = {
      username: form.username.value,
      email: form.email.value,
      password: form.password.value,
    };

    // Basic validation
    if (credentials.password.length < 6) {
      toast.error(t("register.min_chars"));
      return;
    }

    try {
      const promise = registerUser(credentials);

      await toast.promise(promise, {
        loading: t("register.create"),
        success: (data) => {
          // On success, switch back to the login view
          setView("login");
          return data.message; // Show success message from API
        },
        error: (err) =>
          err.message ||
          t("error.registration_failed", {
            defaultValue: "Registration failed. Please try again.",
          }),
      });
    } catch (error) {
      // The toast promise will handle displaying the error.
      console.error("Registration submission failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-neon-green/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-neon-purple/5 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        {/* Left: Premium Brand Showcase */}
        <div className="hidden lg:flex flex-col justify-between glass-morphism rounded-4xl p-12 border border-white/10 shadow-glass-lg hover-lift">
          {/* Header Section */}
          <div className="space-y-8">
            {/* Logo with advanced effects */}
            <div className="relative inline-block group">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple rounded-full blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500 animate-gradient-x"></div>
              <div className="relative bg-gradient-to-br from-neon-green/30 to-neon-blue/30 p-6 rounded-3xl backdrop-blur-xl border border-white/20 group-hover:scale-110 transition-transform duration-500">
                <i className="fas fa-user-plus text-white text-4xl drop-shadow-2xl"></i>
                <div className="absolute inset-0 bg-gradient-to-br from-neon-green/20 to-neon-blue/20 rounded-3xl blur-xl"></div>
              </div>
            </div>

            {/* Brand text */}
            <div className="space-y-4">
              <h1 className="text-5xl font-bold font-space heading-gradient leading-tight tracking-tight">
                {t("register.title")}
              </h1>
              <p className="text-xl text-pro-light font-medium leading-relaxed">
                {t("register.subtitle")}
              </p>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="space-y-6 mt-12">
            <div className="flex items-center gap-4 p-6 glass-ultra rounded-2xl border border-white/5 group hover:border-neon-green/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-green/20 to-neon-blue/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-user-shield text-neon-green text-xl"></i>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">
                  Secure Approval Process
                </h3>
                <p className="text-pro-light text-sm">
                  All accounts require verification to ensure platform security
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 glass-ultra rounded-2xl border border-white/5 group hover:border-neon-pink/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-pink/20 to-neon-purple/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-headset text-neon-pink text-xl"></i>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">
                  24/7 Support Access
                </h3>
                <p className="text-pro-light text-sm">
                  Round-the-clock assistance tools once your account is
                  activated
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 glass-ultra rounded-2xl border border-white/5 group hover:border-neon-blue/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-rocket text-neon-blue text-xl"></i>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">
                  Instant Deployment
                </h3>
                <p className="text-pro-light text-sm">
                  Get started immediately after account approval
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Premium Registration Form */}
        <div className="glass-morphism p-12 rounded-4xl border border-white/10 shadow-glass-lg space-y-8 card-enter">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-neon-green/20 to-neon-blue/20 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
              <i className="fas fa-user-plus text-2xl text-white"></i>
            </div>
            <h2 className="text-3xl font-bold font-space text-white">
              {t("register.create_title")}
            </h2>
            <p className="text-pro-light text-lg">
              {t("register.pending_info")}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-pro-light uppercase tracking-wider">
                {t("register.username")}
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  placeholder={t("register.username_ph")}
                  required
                  className="w-full glass-ultra border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-pro-light/60 focus:border-neon-green/50 focus:outline-none focus:ring-2 focus:ring-neon-green/20 transition-all duration-300 font-medium"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <i className="fas fa-user text-pro-light/40"></i>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-pro-light uppercase tracking-wider">
                {t("auth.email")}
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder={t("auth.email_ph")}
                  required
                  className="w-full glass-ultra border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-pro-light/60 focus:border-neon-blue/50 focus:outline-none focus:ring-2 focus:ring-neon-blue/20 transition-all duration-300 font-medium"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <i className="fas fa-envelope text-pro-light/40"></i>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-pro-light uppercase tracking-wider">
                {t("auth.password")}
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder={t("register.password_ph")}
                  required
                  className="w-full glass-ultra border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-pro-light/60 focus:border-neon-purple/50 focus:outline-none focus:ring-2 focus:ring-neon-purple/20 transition-all duration-300 font-medium"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <i className="fas fa-lock text-pro-light/40"></i>
                </div>
              </div>
              <p className="text-pro-light/70 text-xs mt-2 font-medium">
                {t("register.min_chars")}
              </p>
            </div>

            <button
              type="submit"
              className="w-full pro-button py-5 px-8 text-white font-bold text-lg rounded-2xl hover-lift group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <i className="fas fa-user-plus group-hover:scale-110 transition-transform duration-300"></i>
                {t("register.create")}
              </span>
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center pt-4">
            <p className="text-pro-light">
              {t("register.have_account")}{" "}
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-neon-green font-bold hover:text-neon-blue transition-colors duration-300 focus:outline-none group"
              >
                <span className="border-b border-transparent group-hover:border-neon-blue transition-all duration-300">
                  {t("register.signin_here")}
                </span>
              </button>
            </p>
          </div>

          {/* Approval Notice */}
          <div className="glass-ultra p-6 rounded-2xl border border-neon-blue/20 bg-gradient-to-r from-neon-blue/5 to-neon-purple/5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                <i className="fas fa-info-circle text-neon-blue text-lg"></i>
              </div>
              <div className="space-y-2">
                <h3 className="text-neon-blue font-bold text-sm uppercase tracking-wider">
                  {t("register.approval.title")}
                </h3>
                <p className="text-pro-light text-sm leading-relaxed">
                  {t("register.approval.body")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
