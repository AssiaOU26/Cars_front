// client/src/components/RequestCard.js
import React from "react";
import { useTranslation } from "react-i18next";

const getStatusColor = (status) => {
  switch (status) {
    case "Submitted":
      return "bg-ios-warning text-white";
    case "In Progress":
      return "bg-ios-primary text-white";
    case "Completed":
      return "bg-ios-success text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "Submitted":
      return "fas fa-clock";
    case "In Progress":
      return "fas fa-cog fa-spin";
    case "Completed":
      return "fas fa-check-circle";
    default:
      return "fas fa-question-circle";
  }
};

const getUrgencyColor = (urgency) => {
  switch (urgency) {
    case "LOW":
      return "bg-ios-success/20 text-ios-success border-ios-success/40";
    case "MEDIUM":
      return "bg-ios-warning/20 text-ios-warning border-ios-warning/40";
    case "HIGH":
      return "bg-ios-error/20 text-ios-error border-ios-error/40";
    case "EMERGENCY":
      return "bg-red-500/20 text-red-500 border-red-500/40";
    default:
      return "bg-gray-500/20 text-gray-500 border-gray-500/40";
  }
};

function RequestCard({ request, onAssign, onResolve, onDelete }) {
  const { t } = useTranslation();
  const isCompleted = request.status === "Completed";

  // Parse user info for better display
  const userInfoLines = request.userInfo
    ? request.userInfo.split("\n").filter((line) => line.trim())
    : [];
  const customerName = userInfoLines[0] || "Unknown Customer";
  const carInfo = userInfoLines[1] || "Vehicle info not provided";
  const phone = userInfoLines[2] || "No phone";
  const location = userInfoLines[3] || "Location not specified";

  // Find issue description
  const issueIndex = userInfoLines.findIndex((line) =>
    line.toLowerCase().includes("issue:")
  );
  const issue =
    issueIndex !== -1
      ? userInfoLines[issueIndex].replace(/^issue:\s*/i, "")
      : "No issue description";

  // Get urgency from user info
  const urgencyMatch = request.userInfo?.match(
    /Urgency:\s*(LOW|MEDIUM|HIGH|EMERGENCY)/i
  );
  const urgency = urgencyMatch ? urgencyMatch[1].toUpperCase() : null;

  return (
    <div className={`ios-card relative ${isCompleted ? "opacity-75" : ""}`}>
      {/* Urgency Badge */}
      {urgency && (
        <div className="absolute -top-2 -right-2 z-20">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${getUrgencyColor(
              urgency
            )} font-medium uppercase tracking-wider`}
          >
            {urgency}
          </span>
        </div>
      )}

      {/* Status Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(
            request.status
          )} flex items-center gap-2 font-medium uppercase tracking-wider`}
        >
          <i className={getStatusIcon(request.status)}></i>
          {request.status}
        </span>
      </div>

      {/* Image Section */}
      <div className="relative mb-6 overflow-hidden rounded-xl mt-8">
        <img
          src={
            request.imageUrl ||
            "https://placehold.co/600x400/0A0E27/8B5FFF?text=No+Image+Available"
          }
          alt="Service request"
          className="w-full h-48 object-cover rounded-xl"
        />
      </div>

      {/* Customer Info */}
      <div className="mb-6 space-y-4">
        <div className="ios-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-ios-primary/20 rounded-lg flex items-center justify-center">
              <i className="fas fa-user text-ios-primary text-lg"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-theme-text">
                {customerName}
              </h3>
              <p className="text-xs text-theme-text-tertiary uppercase tracking-wider">
                Customer Information
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 bg-theme-surface rounded-lg">
              <div className="w-6 h-6 bg-ios-warning/20 rounded flex items-center justify-center">
                <i className="fas fa-car text-ios-warning text-sm"></i>
              </div>
              <span className="text-sm text-theme-text font-medium">
                {carInfo}
              </span>
            </div>

            <div className="flex items-center gap-3 p-2 bg-theme-surface rounded-lg">
              <div className="w-6 h-6 bg-ios-success/20 rounded flex items-center justify-center">
                <i className="fas fa-phone text-ios-success text-sm"></i>
              </div>
              <span className="text-sm text-theme-text font-medium">
                {phone}
              </span>
            </div>

            <div className="flex items-center gap-3 p-2 bg-theme-surface rounded-lg">
              <div className="w-6 h-6 bg-ios-error/20 rounded flex items-center justify-center">
                <i className="fas fa-map-marker-alt text-ios-error text-sm"></i>
              </div>
              <span className="text-sm text-theme-text font-medium">
                {location}
              </span>
            </div>
          </div>
        </div>

        {/* Issue Description */}
        <div className="ios-card p-4 border-l-4 border-ios-error">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-ios-error/20 rounded-lg flex items-center justify-center">
              <i className="fas fa-exclamation-triangle text-ios-error text-sm"></i>
            </div>
            <h4 className="text-sm font-bold text-ios-error uppercase tracking-wider">
              {t("request.issue.title")}
            </h4>
          </div>
          <p className="text-theme-text-secondary leading-relaxed">{issue}</p>
        </div>

        {/* Assignment Info */}
        {request.contactName && (
          <div className="ios-card p-4 border-l-4 border-ios-primary">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-ios-primary/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-user-cog text-ios-primary text-sm"></i>
              </div>
              <h4 className="text-sm font-bold text-ios-primary uppercase tracking-wider">
                {t("request.assignment.title")}
              </h4>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-theme-surface rounded-lg">
                <span className="text-xs text-theme-text-tertiary uppercase tracking-wider font-medium">
                  {t("request.assignment.operator")}
                </span>
                <span className="text-sm text-theme-text font-semibold">
                  {request.contactName}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 bg-theme-surface rounded-lg">
                <span className="text-xs text-theme-text-tertiary uppercase tracking-wider font-medium">
                  {t("request.assignment.assigned_by")}
                </span>
                <span className="text-sm text-theme-text font-semibold">
                  {request.userName}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-theme-border">
        {onResolve && (
          <button
            onClick={() => onResolve(request.id)}
            disabled={isCompleted}
            className="flex-1 ios-button ios-button-success disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-check mr-2"></i>
            <span>{t("request.actions.resolve")}</span>
          </button>
        )}
        {onAssign && (
          <button
            onClick={() => onAssign(request.id)}
            disabled={isCompleted}
            className="flex-1 ios-button ios-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-user-plus mr-2"></i>
            <span>
              {request.contactName
                ? t("request.actions.reassign")
                : t("request.actions.assign")}
            </span>
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(request.id)}
            className="w-full ios-button ios-button-error"
          >
            <i className="fas fa-trash mr-2"></i>
            <span>{t("request.actions.delete")}</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default RequestCard;
