import React, { useState, useEffect, useCallback } from "react";
import {
  fetchContacts,
  createContact,
  updateContact,
  deleteContact,
  fetchRequests,
  deleteRequest,
  fetchUsers,
  updateUserStatus,
  updateRequestStatus,
} from "../api";
import ContactCrudModal from "./ContactCrudModal";
import toast from "react-hot-toast";
import RequestCard from "./RequestCard";
import Footer from "../components/Footer";
import AssignmentModal from "./AssignmentModal";
import RequestCreateModal from "./RequestCreateModal";
import { useAuth } from "../context/AuthContext";

function SuperAdminView() {
  // State for data
  const [contacts, setContacts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]); // RENAMED: from admins to users
  const [isLoading, setIsLoading] = useState(true);

  // State for UI
  const [activeTab, setActiveTab] = useState("operators");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user: currentUser } = useAuth();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [contactsData, requestsData, usersData] = await Promise.all([
        fetchContacts(),
        fetchRequests({
          status: statusFilter || undefined,
          q: searchQuery || undefined,
          limit: 100,
        }),
        fetchUsers(), // UPDATED: Fetching users now
      ]);
      setContacts(contactsData);
      setRequests(requestsData);
      setUsers(usersData); // UPDATED: Setting users state
    } catch (error) {
      toast.error("Could not load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- Contact Modal Handlers ---
  const handleOpenContactModal = (contact = null) => {
    setEditingContact(contact);
    setIsContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setEditingContact(null);
    setIsContactModalOpen(false);
  };

  // --- Contact CRUD Handlers ---
  const handleSaveContact = async (contactData) => {
    const action = editingContact
      ? updateContact(editingContact.id, contactData)
      : createContact(contactData);
    try {
      await toast.promise(action, {
        loading: "Saving operator...",
        success: "Operator saved successfully!",
        error: "Failed to save operator.",
      });
      handleCloseContactModal();
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (window.confirm("Are you sure you want to delete this operator?")) {
      try {
        await toast.promise(deleteContact(contactId), {
          loading: "Deleting operator...",
          success: "Operator deleted.",
          error: "Failed to delete operator.",
        });
        loadData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  // --- User Status Handler ---
  const handleUserStatusUpdate = async (userId, newStatus) => {
    if (
      currentUser?.id === userId &&
      (newStatus === "inactive" || newStatus === "denied")
    ) {
      toast.error(
        "You cannot deactivate or delete your own superadmin account."
      );
      return;
    }
    const action = updateUserStatus(userId, newStatus);
    try {
      await toast.promise(action, {
        loading: "Updating user status...",
        success: (data) => data.message,
        error: (err) => err.message,
      });
      loadData(); // Refresh the user list
    } catch (error) {
      console.error(error);
    }
  };

  // --- Admin-like request handlers ---
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
      toast.success("Request marked as completed!");
      loadData();
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  // --- Request Delete Handler ---
  const handleDeleteRequest = async (requestId) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this request?"
      )
    ) {
      try {
        await toast.promise(deleteRequest(requestId), {
          loading: "Deleting request...",
          success: "Request deleted.",
          error: "Failed to delete request.",
        });
        loadData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  // --- Helper to get status color ---
  const getStatusPillClass = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-300";
      case "inactive":
        return "bg-gray-500/20 text-gray-300";
      case "pending":
        return "bg-yellow-500/20 text-yellow-300";
      default:
        return "bg-red-500/20 text-red-300";
    }
  };

  // Filter users by status for easier management
  const pendingUsers = users.filter((u) => u.status === "pending");
  const managedUsers = users.filter((u) => u.status !== "pending");

  return (
    <>
      {/* Superadmin modals for admin-like actions */}
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

      <ContactCrudModal
        isOpen={isContactModalOpen}
        onClose={handleCloseContactModal}
        onSave={handleSaveContact}
        initialData={editingContact}
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* SuperAdmin Header */}
        <div className="ios-card p-8">
          <div className="flex items-center gap-8 mb-10">
            <div className="ios-header-brand flex items-center justify-center w-24 h-24">
              <i className="fas fa-crown text-white text-4xl"></i>
            </div>
            <div>
              <h1 className="text-5xl font-bold text-theme-text mb-3">
                Super Admin Console
              </h1>
              <p className="text-theme-text-secondary text-xl font-medium uppercase tracking-wider">
                Complete Platform Control
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center">
            <div className="bg-theme-surface rounded-3xl p-2 border border-theme-border">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("operators")}
                  className={`relative px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                    activeTab === "operators"
                      ? "bg-ios-primary text-white"
                      : "text-theme-text-secondary hover:text-theme-text hover:bg-theme-surface"
                  }`}
                >
                  <i className="fas fa-users-cog"></i>
                  <span>Operators</span>
                </button>

                <button
                  onClick={() => setActiveTab("requests")}
                  className={`relative px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                    activeTab === "requests"
                      ? "bg-ios-success text-white"
                      : "text-theme-text-secondary hover:text-theme-text hover:bg-theme-surface"
                  }`}
                >
                  <i className="fas fa-tasks"></i>
                  <span>Requests</span>
                </button>

                <button
                  onClick={() => setActiveTab("users")}
                  className={`relative px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                    activeTab === "users"
                      ? "bg-ios-secondary text-white"
                      : "text-theme-text-secondary hover:text-theme-text hover:bg-theme-surface"
                  }`}
                >
                  <i className="fas fa-user-shield"></i>
                  <span>User Management</span>
                </button>
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
                Loading Super Admin Console
              </h3>
              <p className="text-theme-text-secondary">
                Initializing system...
              </p>
            </div>
          ) : (
            <div className="p-8">
              {/* Operators Panel */}
              {activeTab === "operators" && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-xl flex items-center justify-center">
                        <i className="fas fa-users-cog text-neon-blue text-xl"></i>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold font-space text-white">
                          Operator Management
                        </h2>
                        <p className="text-pro-light text-sm uppercase tracking-wider">
                          Manage Assessment Team
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleOpenContactModal()}
                      className="pro-button py-3 px-6 text-white font-semibold rounded-2xl hover-lift group flex items-center gap-3"
                    >
                      <i className="fas fa-plus group-hover:scale-110 transition-transform duration-300"></i>
                      <span>Add Operator</span>
                    </button>
                  </div>

                  <div className="grid gap-6">
                    {contacts.map((contact, index) => (
                      <div
                        key={contact.id}
                        className="glass-ultra p-6 rounded-2xl border border-white/5 hover-lift card-enter"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-neon-blue/20 to-neon-green/20 rounded-2xl flex items-center justify-center border border-white/10">
                              <i className="fas fa-user-cog text-neon-blue text-xl"></i>
                            </div>
                            <div>
                              <h4 className="font-bold text-lg text-white mb-1">
                                {contact.name}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-pro-light">
                                <span className="flex items-center gap-2">
                                  <i className="fas fa-phone text-xs"></i>
                                  {contact.phone}
                                </span>
                                <span className="flex items-center gap-2">
                                  <i className="fas fa-envelope text-xs"></i>
                                  {contact.email}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleOpenContactModal(contact)}
                              className="px-4 py-2 bg-neon-blue/20 text-neon-blue border border-neon-blue/30 rounded-xl text-sm font-medium hover:bg-neon-blue/30 transition-all duration-300"
                            >
                              <i className="fas fa-edit mr-2"></i>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteContact(contact.id)}
                              className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-sm font-medium hover:bg-red-500/30 transition-all duration-300"
                            >
                              <i className="fas fa-trash mr-2"></i>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requests Panel */}
              {activeTab === "requests" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-neon-green/20 to-neon-blue/20 rounded-xl flex items-center justify-center">
                      <i className="fas fa-tasks text-neon-green text-xl"></i>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold font-space text-white">
                        Request Management
                      </h2>
                      <p className="text-pro-light text-sm uppercase tracking-wider">
                        Full Request Control
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Filters */}
                  <div className="glass-ultra p-6 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between gap-6 flex-wrap">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-3">
                          <i className="fas fa-filter text-neon-green text-sm"></i>
                          <label className="text-xs font-semibold text-pro-light uppercase tracking-wider">
                            Filters
                          </label>
                        </div>

                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="glass-ultra border border-white/10 rounded-xl px-4 py-2 text-white text-sm font-medium focus:border-neon-green/50 focus:outline-none min-w-[140px]"
                        >
                          <option value="">All Status</option>
                          <option value="Submitted">Submitted</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>

                        <div className="relative flex-1 max-w-sm">
                          <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search requests..."
                            className="w-full glass-ultra border border-white/10 rounded-xl px-4 py-2 pl-10 text-white placeholder-pro-light/60 focus:border-neon-blue/50 focus:outline-none text-sm font-medium"
                          />
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <i className="fas fa-search text-pro-light/40 text-xs"></i>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="pro-button py-3 px-6 text-white font-semibold rounded-2xl hover-lift group flex items-center gap-3"
                      >
                        <i className="fas fa-plus group-hover:scale-110 transition-transform duration-300"></i>
                        <span>New Request</span>
                      </button>
                    </div>
                  </div>

                  {/* Requests Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {requests.map((req, index) => (
                      <div
                        key={req.id}
                        className="card-enter"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <RequestCard
                          request={req}
                          onAssign={handleOpenModal}
                          onResolve={handleMarkResolved}
                          onDelete={handleDeleteRequest}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* User Management Panel */}
              {activeTab === "users" && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 rounded-xl flex items-center justify-center">
                      <i className="fas fa-user-shield text-neon-purple text-xl"></i>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold font-space text-white">
                        User Management
                      </h2>
                      <p className="text-pro-light text-sm uppercase tracking-wider">
                        Platform Access Control
                      </p>
                    </div>
                  </div>

                  {/* Pending Users Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-neon-yellow/20 to-neon-yellow/10 rounded-lg flex items-center justify-center">
                        <i className="fas fa-hourglass-half text-neon-yellow text-sm"></i>
                      </div>
                      <h3 className="text-xl font-bold text-neon-yellow">
                        Pending Approval ({pendingUsers.length})
                      </h3>
                    </div>

                    {pendingUsers.length > 0 ? (
                      <div className="grid gap-4">
                        {pendingUsers.map((user, index) => (
                          <div
                            key={user.id}
                            className="glass-ultra p-6 rounded-2xl border border-neon-yellow/20 hover-lift card-enter"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-neon-yellow/20 to-neon-purple/20 rounded-xl flex items-center justify-center border border-white/10">
                                  <i className="fas fa-user-clock text-neon-yellow text-lg"></i>
                                </div>
                                <div>
                                  <h4 className="font-bold text-lg text-white mb-1">
                                    {user.username}
                                  </h4>
                                  <p className="text-sm text-pro-light flex items-center gap-2">
                                    <i className="fas fa-envelope text-xs"></i>
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() =>
                                    handleUserStatusUpdate(user.id, "active")
                                  }
                                  className="px-6 py-3 bg-neon-green/20 text-neon-green border border-neon-green/30 rounded-xl font-semibold hover:bg-neon-green/30 transition-all duration-300 flex items-center gap-2"
                                >
                                  <i className="fas fa-check"></i>
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    handleUserStatusUpdate(user.id, "denied")
                                  }
                                  className="px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-semibold hover:bg-red-500/30 transition-all duration-300 flex items-center gap-2"
                                >
                                  <i className="fas fa-times"></i>
                                  Deny
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="glass-ultra p-8 rounded-2xl border border-white/5 text-center">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-neon-green/20 to-neon-blue/20 rounded-2xl flex items-center justify-center mb-4">
                          <i className="fas fa-check-circle text-neon-green text-2xl"></i>
                        </div>
                        <p className="text-pro-light text-lg">
                          No users are currently pending approval.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Active & Inactive Users Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-lg flex items-center justify-center">
                        <i className="fas fa-users text-neon-blue text-sm"></i>
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        Active & Inactive Users ({managedUsers.length})
                      </h3>
                    </div>

                    <div className="grid gap-4">
                      {managedUsers.map((user, index) => (
                        <div
                          key={user.id}
                          className="glass-ultra p-6 rounded-2xl border border-white/5 hover-lift card-enter"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 ${
                                  user.status === "active"
                                    ? "bg-gradient-to-br from-neon-green/20 to-neon-blue/20"
                                    : "bg-gradient-to-br from-gray-500/20 to-gray-400/20"
                                }`}
                              >
                                <i
                                  className={`fas ${
                                    user.status === "active"
                                      ? "fa-user-check"
                                      : "fa-user-slash"
                                  } text-lg ${
                                    user.status === "active"
                                      ? "text-neon-green"
                                      : "text-gray-400"
                                  }`}
                                ></i>
                              </div>
                              <div>
                                <h4 className="font-bold text-lg text-white mb-1">
                                  {user.username}
                                </h4>
                                <p className="text-sm text-pro-light flex items-center gap-2">
                                  <i className="fas fa-envelope text-xs"></i>
                                  {user.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${getStatusPillClass(
                                  user.status || "pending"
                                )}`}
                              >
                                {user.status || "pending"}
                              </span>
                              {currentUser?.id !== user.id &&
                                user.status === "active" && (
                                  <button
                                    onClick={() =>
                                      handleUserStatusUpdate(
                                        user.id,
                                        "inactive"
                                      )
                                    }
                                    className="px-4 py-2 bg-gray-500/20 text-gray-300 border border-gray-500/30 rounded-xl text-sm font-medium hover:bg-gray-500/30 transition-all duration-300 flex items-center gap-2"
                                  >
                                    <i className="fas fa-pause"></i>
                                    Deactivate
                                  </button>
                                )}
                              {currentUser?.id !== user.id &&
                                user.status === "inactive" && (
                                  <button
                                    onClick={() =>
                                      handleUserStatusUpdate(user.id, "active")
                                    }
                                    className="px-4 py-2 bg-neon-blue/20 text-neon-blue border border-neon-blue/30 rounded-xl text-sm font-medium hover:bg-neon-blue/30 transition-all duration-300 flex items-center gap-2"
                                  >
                                    <i className="fas fa-play"></i>
                                    Reactivate
                                  </button>
                                )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-8">
        <Footer />
        {/* test */}
      </div>
    </>
  );
}

export default SuperAdminView;
