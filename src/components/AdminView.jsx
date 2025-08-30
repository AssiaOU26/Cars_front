import React, { useState, useEffect, useCallback } from "react";
import {
  fetchRequests,
  fetchContacts,
  fetchUsers,
  updateRequestStatus,
  fetchOverviewStats,
  createRequestJson,
} from "../api";
import AssignmentModal from "./AssignmentModal";
import RequestCreateModal from "./RequestCreateModal";
import toast from "react-hot-toast";
import RequestCard from "./RequestCard";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

function AdminView() {
  const [requests, setRequests] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { t } = useTranslation();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [requestsData, contactsData, usersData, statsData] =
        await Promise.all([
          fetchRequests({
            status: statusFilter || undefined,
            q: searchQuery || undefined,
            limit: 100,
          }),
          fetchContacts(),
          fetchUsers(),
          fetchOverviewStats(),
        ]);
      setRequests(requestsData);
      setContacts(contactsData);
      setUsers(usersData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error(
        t("error.load_dashboard", {
          defaultValue:
            "Could not load dashboard data. Please check the console.",
        })
      );
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const id = setInterval(() => {
      loadData();
    }, 15000);
    return () => clearInterval(id);
  }, [loadData]);

  const handleOpenModal = (requestId) => {
    setSelectedRequestId(requestId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequestId(null);
  };

  const handleMarkResolved = async (requestId) => {
    try {
      await updateRequestStatus(requestId, "Completed");
      toast.success(
        t("toast.request_completed", {
          defaultValue: "Request marked as completed!",
        })
      );
      loadData();
    } catch (error) {
      toast.error(
        t("error.update_status_failed", {
          defaultValue: "Failed to update status.",
        })
      );
    }
  };

  return (
    <>
      <AssignmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        requestId={selectedRequestId}
        contacts={contacts}
        users={users}
        onAssignmentSuccess={loadData}
      />

      <RequestCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        contacts={contacts}
        onSuccess={loadData}
      />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Dashboard Header */}
        <div className="ios-card">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="ios-header-brand flex items-center justify-center w-16 h-16">
                <i className="fas fa-tachometer-alt text-white text-2xl"></i>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-theme-text mb-2">
                  {t("dashboard.admin")}
                </h2>
                <p className="text-theme-text-secondary text-lg font-medium">
                  Administrative Dashboard
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="ios-button ios-button-primary px-8 py-4 text-lg font-semibold"
            >
              <i className="fas fa-plus mr-3 text-lg"></i>
              <span>{t("dashboard.new_request")}</span>
            </button>
          </div>

          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="ios-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-semibold text-theme-text">
                      {stats.totalRequests}
                    </div>
                    <div className="text-sm text-theme-text-tertiary">
                      {t("dashboard.total")}
                    </div>
                  </div>
                  <i className="fas fa-chart-bar text-ios-primary text-lg"></i>
                </div>
              </div>

              <div className="ios-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-semibold text-ios-warning">
                      {stats.submitted}
                    </div>
                    <div className="text-sm text-theme-text-tertiary">
                      {t("dashboard.pending")}
                    </div>
                  </div>
                  <i className="fas fa-clock text-ios-warning text-lg"></i>
                </div>
              </div>

              <div className="ios-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-semibold text-ios-primary">
                      {stats.inProgress}
                    </div>
                    <div className="text-sm text-theme-text-tertiary">
                      {t("dashboard.in_progress")}
                    </div>
                  </div>
                  <i className="fas fa-spinner text-ios-primary text-lg"></i>
                </div>
              </div>

              <div className="ios-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-semibold text-ios-success">
                      {stats.completed}
                    </div>
                    <div className="text-sm text-theme-text-tertiary">
                      {t("dashboard.completed")}
                    </div>
                  </div>
                  <i className="fas fa-check-circle text-ios-success text-lg"></i>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="ios-card p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <i className="fas fa-filter text-ios-primary text-sm"></i>
              <span className="text-theme-text font-medium">Filters</span>
            </div>

            <div className="flex items-center gap-3 flex-1 min-w-0">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="ios-input px-3 py-2 text-sm"
              >
                <option value="">{t("dashboard.filters.all")}</option>
                <option value="Submitted">
                  {t("dashboard.filters.submitted")}
                </option>
                <option value="In Progress">
                  {t("dashboard.filters.in_progress")}
                </option>
                <option value="Completed">
                  {t("dashboard.filters.completed")}
                </option>
              </select>

              <div className="relative flex-1 max-w-md">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("dashboard.search_ph")}
                  className="ios-input pl-9"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <i className="fas fa-search text-theme-text-tertiary text-sm"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="ios-card overflow-hidden">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="ios-loading mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-theme-text mb-2">
                {t("dashboard.loading")}
              </h3>
              <p className="text-theme-text-secondary">
                Fetching latest data...
              </p>
            </div>
          ) : (
            <div className="p-6">
              {requests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {requests.map((req, index) => (
                    <div
                      key={req.id}
                      className="fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <RequestCard
                        request={req}
                        onAssign={handleOpenModal}
                        onResolve={handleMarkResolved}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="w-24 h-24 mx-auto bg-theme-surface rounded-2xl flex items-center justify-center border border-theme-border">
                      <i className="fas fa-clipboard-list text-3xl text-theme-text-tertiary"></i>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-theme-text">
                        {t("dashboard.empty.title")}
                      </h3>
                      <p className="text-theme-text-secondary text-lg">
                        {t("dashboard.empty.body")}
                      </p>
                    </div>

                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="ios-button ios-button-primary py-4 px-8"
                    >
                      <i className="fas fa-plus mr-2"></i>
                      {t("dashboard.empty.cta")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AdminView;
