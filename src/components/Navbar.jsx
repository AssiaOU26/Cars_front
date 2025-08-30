import React, { useEffect, useState } from "react";
import { fetchOverviewStats } from "../api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

function Navbar() {
  const [stats, setStats] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    let isMounted = true;
    fetchOverviewStats()
      .then((data) => {
        if (isMounted) setStats(data);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString(i18n.language === "fr" ? "fr-FR" : "en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString(i18n.language === "fr" ? "fr-FR" : "en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    try {
      localStorage.setItem("language", lng);
    } catch (e) {}
  };

  return (
    <header className="ios-header">
      <div className="container mx-auto px-6">
        {/* Main Header Row */}
        <div className="flex items-center justify-between py-6">
          {/* Brand Section */}
          <div className="flex items-center gap-6">
            <div className="ios-header-brand flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <i className="fas fa-car-crash text-ios-primary text-xl font-bold"></i>
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold leading-tight">
                  {t("brand")}
                </h1>
                <p className="text-xs text-white/80 uppercase tracking-wider font-medium">
                  {t("tagline")}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className="hidden xl:flex items-center">
            {stats && (
              <div className="ios-header-stats flex items-center gap-8 px-8 py-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-theme-text mb-1">
                    {stats.totalRequests}
                  </div>
                  <div className="text-xs text-theme-text-tertiary uppercase tracking-wider font-semibold">
                    {t("stats.total")}
                  </div>
                </div>

                <div className="w-px h-10 bg-theme-border"></div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-ios-warning mb-1">
                    {stats.submitted}
                  </div>
                  <div className="text-xs text-theme-text-tertiary uppercase tracking-wider font-semibold">
                    {t("stats.pending")}
                  </div>
                </div>

                <div className="w-px h-10 bg-theme-border"></div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-ios-primary mb-1">
                    {stats.inProgress}
                  </div>
                  <div className="text-xs text-theme-text-tertiary uppercase tracking-wider font-semibold">
                    {t("stats.active")}
                  </div>
                </div>

                <div className="w-px h-10 bg-theme-border"></div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-ios-success mb-1">
                    {stats.completed}
                  </div>
                  <div className="text-xs text-theme-text-tertiary uppercase tracking-wider font-semibold">
                    {t("stats.done")}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="ios-header-controls flex items-center gap-3 px-4 py-3">
              <i className="fas fa-globe text-ios-primary text-sm"></i>
              <select
                value={i18n.language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-transparent text-sm text-theme-text font-semibold focus:outline-none cursor-pointer min-w-[60px]"
              >
                <option value="en">EN</option>
                <option value="fr">FR</option>
              </select>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="ios-header-controls p-3 hover:scale-105 transition-transform duration-300"
              title={t("theme.switch", { mode: isDark ? "light" : "dark" })}
            >
              <i
                className={`fas ${
                  isDark ? "fa-sun" : "fa-moon"
                } text-lg text-theme-text`}
              ></i>
            </button>

            {/* Time Display */}
            <div className="hidden lg:block ios-header-controls text-center px-4 py-3">
              <div className="text-lg font-mono font-bold text-theme-text">
                {formatTime(currentTime)}
              </div>
              <div className="text-xs text-theme-text-tertiary uppercase tracking-wider font-semibold">
                {formatDate(currentTime)}
              </div>
            </div>

            {/* User Badge */}
            {user && (
              <div className="ios-header-controls flex items-center gap-4 px-4 py-3">
                <div className="w-3 h-3 rounded-full bg-ios-success animate-pulse"></div>
                <div className="text-right">
                  <div className="text-sm font-bold text-theme-text">
                    {user.username}
                  </div>
                  <div className="text-xs text-theme-text-tertiary uppercase tracking-wider font-semibold">
                    {user.role === "super_admin"
                      ? t("role.super_admin")
                      : t("role.admin")}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Stats Bar */}
      <div className="lg:hidden border-t border-theme-border/50 bg-theme-surface/50">
        <div className="container mx-auto px-6">
          <div className="flex justify-center py-4">
            {stats && (
              <div className="ios-header-stats flex items-center gap-6 px-6 py-4">
                <span className="flex items-center gap-2 text-theme-text-secondary text-sm font-semibold">
                  <i className="fas fa-chart-bar text-xs"></i>
                  {t("dashboard.total")}:{" "}
                  <span className="text-theme-text font-bold">
                    {stats.totalRequests}
                  </span>
                </span>
                <span className="flex items-center gap-2 text-theme-text-secondary text-sm font-semibold">
                  <div className="w-2 h-2 bg-ios-warning rounded-full"></div>
                  {t("dashboard.pending")}:{" "}
                  <span className="text-ios-warning font-bold">
                    {stats.submitted}
                  </span>
                </span>
                <span className="flex items-center gap-2 text-theme-text-secondary text-sm font-semibold">
                  <div className="w-2 h-2 bg-ios-primary rounded-full"></div>
                  {t("stats.active")}:{" "}
                  <span className="text-ios-primary font-bold">
                    {stats.inProgress}
                  </span>
                </span>
                <span className="flex items-center gap-2 text-theme-text-secondary text-sm font-semibold">
                  <div className="w-2 h-2 bg-ios-success rounded-full"></div>
                  {t("stats.done")}:{" "}
                  <span className="text-ios-success font-bold">
                    {stats.completed}
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
