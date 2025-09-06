import React, { useState, useEffect } from "react";
import { submitAssignment } from "../api";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

function AssignmentModal({
  isOpen,
  onClose,
  requestId,
  contacts,
  users,
  onAssignmentSuccess,
}) {
  const [assigneeId, setAssigneeId] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("assigned");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  // Reset state when the modal is closed or the requestId changes
  useEffect(() => {
    if (!isOpen) {
      setAssigneeId("");
      setNotes("");
      setStatus("assigned");
    }
  }, [isOpen]);

  // Filter users to only show admins and super_admins for assignment
  const availableAssignees = users.filter(
    (user) => user.role === "admin" || user.role === "super_admin"
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!assigneeId) {
      toast.error(
        t("error.assignment_select_assignee", {
          defaultValue: "Please select an assignee.",
        })
      );
      return;
    }
    setIsSubmitting(true);
    try {
      await submitAssignment({
        requestId,
        userId: assigneeId,
        notes,
        status,
      });
      toast.success(
        t("toast.assignment_success", {
          defaultValue: "Request assigned successfully!",
        })
      );
      onAssignmentSuccess();
      onClose();
    } catch (error) {
      toast.error(
        t("error.assignment_failed", { defaultValue: "Assignment failed." })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // We wrap the content in another component to handle the mount/unmount transition
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`glass-effect rounded-lg p-6 shadow-2xl transform transition-all duration-300 max-w-md w-full mx-4 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">
            {t("modal.assignment.title")}
          </h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="assignment-assignee"
              className="block text-sm font-medium text-white/90 mb-1"
            >
              {t("modal.assignment.select_assignee", {
                defaultValue: "Assign to",
              })}
            </label>
            <select
              id="assignment-assignee"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            >
              <option value="">
                {t("modal.assignment.choose_assignee", {
                  defaultValue: "Select an admin to assign this request to",
                })}
              </option>
              {availableAssignees.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username} (
                  {user.role === "super_admin" ? "Super Admin" : "Admin"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="assignment-status"
              className="block text-sm font-medium text-white/90 mb-1"
            >
              {t("modal.assignment.status", { defaultValue: "Status" })}
            </label>
            <select
              id="assignment-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="assigned">
                {t("modal.assignment.assigned", { defaultValue: "Assigned" })}
              </option>
              <option value="in_progress">
                {t("modal.assignment.in_progress", {
                  defaultValue: "In Progress",
                })}
              </option>
              <option value="completed">
                {t("modal.assignment.completed", { defaultValue: "Completed" })}
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="assignment-notes"
              className="block text-sm font-medium text-white/90 mb-1"
            >
              {t("modal.assignment.notes", {
                defaultValue: "Notes (Optional)",
              })}
            </label>
            <textarea
              id="assignment-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("modal.assignment.notes_placeholder", {
                defaultValue:
                  "Add any additional notes about this assignment...",
              })}
              className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
              rows="3"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-500 transition-colors"
            >
              {isSubmitting
                ? t("modal.assignment.assigning", {
                    defaultValue: "Assigning...",
                  })
                : t("modal.assignment.assign", {
                    defaultValue: "Assign Request",
                  })}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              {t("modal.cancel", { defaultValue: "Cancel" })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssignmentModal;
