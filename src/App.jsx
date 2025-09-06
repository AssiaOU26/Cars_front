import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import AdminView from "./components/AdminView";
import SuperAdminView from "./components/SuperAdminView";
import AuthPage from "./components/AuthPage";
import RegisterPage from "./components/RegisterPage";
import { useTranslation } from "react-i18next";
import OnboardingWizard from "./components/OnboardingWizard";

function Dashboard() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const getViewForRole = () => {
    // Check if user is pending approval
    if (user?.status === "pending") {
      return (
        <div className="ios-card max-w-2xl mx-auto mt-20 text-center">
          <div className="w-20 h-20 mx-auto bg-ios-warning rounded-full flex items-center justify-center mb-6">
            <i className="fas fa-clock text-white text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-theme-text mb-4">
            {t("auth.pending_approval", {
              defaultValue: "Account Pending Approval",
            })}
          </h2>
          <p className="text-theme-text-secondary text-lg">
            {t("auth.pending_message", {
              defaultValue:
                "Your account is pending approval from a super administrator. You'll receive access once approved.",
            })}
          </p>
        </div>
      );
    }

    // Check user role for active users
    switch (user?.role) {
      case "super_admin":
        return <SuperAdminView />;
      case "admin":
        return <AdminView />;
      default:
        return (
          <div className="ios-card max-w-2xl mx-auto mt-20 text-center">
            <div className="w-20 h-20 mx-auto bg-ios-primary rounded-full flex items-center justify-center mb-6">
              <i className="fas fa-user-shield text-white text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-theme-text mb-4">
              {t("auth.welcome", { defaultValue: "Welcome!" })}
            </h2>
            <p className="text-theme-text-secondary text-lg">
              {t("auth.no_admin_privileges", {
                defaultValue:
                  "You do not have admin privileges for this platform.",
              })}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-theme-bg">
      <Navbar />

      <button onClick={logout} className="ios-logout-button">
        <i className="fas fa-sign-out-alt mr-2"></i>
        <span className="hidden sm:block">{t("auth.logout")}</span>
      </button>

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="fade-in-up">{getViewForRole()}</div>
      </main>
    </div>
  );
}

function App() {
  const { user } = useAuth();
  const [authView, setAuthView] = useState("login");
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try {
      return user && localStorage.getItem("onboardingCompleted") !== "true";
    } catch {
      return false;
    }
  });

  const renderAuthView = () => {
    switch (authView) {
      case "register":
        return <RegisterPage setView={setAuthView} />;
      case "login":
      default:
        return <AuthPage setView={setAuthView} />;
    }
  };

  return (
    <div className="ios-bg min-h-screen">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--bg-elevated)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-color)",
            borderRadius: "12px",
          },
        }}
      />

      <div className="flex-1">{user ? <Dashboard /> : renderAuthView()}</div>

      {user && showOnboarding && (
        <OnboardingWizard onClose={() => setShowOnboarding(false)} />
      )}
    </div>
  );
}

export default App;
