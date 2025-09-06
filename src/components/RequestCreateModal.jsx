import React, { useState, useEffect } from "react";
import { createRequest, createRequestJson } from "../api";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

function RequestCreateModal({ isOpen, onClose, contacts, onSuccess }) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    location: "",
    carModel: "",
    carYear: "",
    issueDescription: "",
    urgencyLevel: "medium",
    imageUrl: "",
    assignToOperator: "",
    customerInfoText: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        customerName: "",
        customerPhone: "",
        location: "",
        carModel: "",
        carYear: "",
        issueDescription: "",
        urgencyLevel: "medium",
        imageUrl: "",
        assignToOperator: "",
        customerInfoText: "",
      });
      setSelectedFile(null);
      setImagePreview(null);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const parseCustomerInfo = (text) => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // Parse car model and year from line 2
    let carModel = "";
    let carYear = "";
    if (lines[1]) {
      // Look for year at the end (4 digits)
      const yearMatch = lines[1].match(/(\d{4})$/);
      if (yearMatch) {
        carYear = yearMatch[1];
        carModel = lines[1].replace(/\s+\d{4}$/, "").trim();
      } else {
        // If no year found, treat the whole line as model
        carModel = lines[1];
      }
    }

    return {
      customerName: lines[0] || "",
      carModel: carModel,
      carYear: carYear,
      customerPhone: lines[2] || "",
      location: lines[3] || "",
    };
  };

  const handleCustomerInfoChange = (e) => {
    // Just update the textarea value, don't parse yet
    setFormData((prev) => ({
      ...prev,
      customerInfoText: e.target.value,
    }));
  };

  const handleCustomerInfoBlur = (e) => {
    // Parse only when user finishes typing (on blur)
    const parsedInfo = parseCustomerInfo(e.target.value);
    setFormData((prev) => ({
      ...prev,
      ...parsedInfo,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      // Clear URL if file is selected
      setFormData((prev) => ({ ...prev, imageUrl: "" }));
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, imageUrl: url }));
    if (url) {
      setSelectedFile(null);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Build user info string
      const userInfo = `${formData.customerName}
${formData.carModel} ${formData.carYear}
${formData.customerPhone}
${formData.location}

Issue: ${formData.issueDescription}
Urgency: ${formData.urgencyLevel.toUpperCase()}`;

      let requestData;

      if (selectedFile) {
        // Use FormData for file upload
        const formDataObj = new FormData();
        formDataObj.append("title", formData.issueDescription);
        formDataObj.append("description", userInfo);
        formDataObj.append("userInfo", userInfo);
        formDataObj.append("photo", selectedFile);
        requestData = await createRequest(formDataObj);
      } else {
        // Use JSON for URL or no image
        requestData = await createRequestJson({
          title: formData.issueDescription,
          description: userInfo,
          userInfo,
          imageUrl: formData.imageUrl || null,
        });
      }

      toast.success(
        t("toast.request_created", {
          defaultValue: "Request created successfully!",
        })
      );

      // If operator is selected, create assignment
      if (formData.assignToOperator && requestData.id) {
        try {
          await fetch("/api/assignments", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              requestId: requestData.id,
              operatorId: formData.assignToOperator,
              userId: JSON.parse(
                atob(localStorage.getItem("token").split(".")[1])
              ).id,
              status: "assigned",
            }),
          });
          toast.success(
            t("toast.request_assigned", {
              defaultValue: "Request assigned to operator!",
            })
          );
        } catch (assignError) {
          console.warn("Assignment failed:", assignError);
          toast.error(
            t("error.assignment_partial", {
              defaultValue: "Request created but assignment failed",
            })
          );
        }
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        t("error.create_request_failed", {
          defaultValue: "Failed to create request.",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="glass-effect rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-theme-border">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-theme-text">
              {t("modal.create_request.title")}
            </h2>
            <button
              onClick={onClose}
              className="text-theme-text-secondary hover:text-theme-text text-2xl"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Merged Customer & Vehicle Information */}
          <div>
            <h3 className="text-lg font-semibold text-theme-text border-b border-theme-border pb-2 mb-4">
              <i className="fas fa-user mr-2"></i>Customer & Vehicle Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-theme-text-secondary mb-2">
                {t("modal.customer_info")} & {t("modal.vehicle_info")}
              </label>
              <textarea
                name="customerInfo"
                value={
                  formData.customerInfoText ||
                  [
                    formData.customerName,
                    `${formData.carModel} ${formData.carYear}`.trim(),
                    formData.customerPhone,
                    formData.location,
                  ].join("\n")
                }
                onChange={handleCustomerInfoChange}
                onBlur={handleCustomerInfoBlur}
                required
                rows="4"
                className="w-full bg-theme-surface border border-theme-border rounded-lg px-4 py-3 text-theme-text placeholder-theme-text-tertiary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Line 1: ${t("modal.customer_name_ph")}
Line 2: ${t("modal.car_model_ph")} ${t(
                  "modal.year"
                )} (e.g., Toyota Corolla 2020)
Line 3: ${t("modal.phone_ph")}
Line 4: ${t("modal.location_ph")}

⚠️ Put each answer on a separate line`}
              />
              <p className="text-xs text-theme-text-tertiary mt-2">
                <i className="fas fa-info-circle mr-1"></i>
                <strong>Format:</strong>
                <br />
                • Name on line 1<br />
                • Car Model & Year on line 2<br />
                • Phone on line 3<br />• Location on line 4
              </p>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-theme-text-secondary mb-2">
                {t("modal.urgency")}
              </label>
              <select
                name="urgencyLevel"
                value={formData.urgencyLevel}
                onChange={handleInputChange}
                className="w-full bg-theme-surface border border-theme-border rounded-lg px-4 py-3 text-theme-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">{t("modal.urgency.low")}</option>
                <option value="medium">{t("modal.urgency.medium")}</option>
                <option value="high">{t("modal.urgency.high")}</option>
                <option value="emergency">
                  {t("modal.urgency.emergency")}
                </option>
              </select>
            </div>
          </div>

          {/* Issue Description */}
          <div>
            <label className="block text-sm font-medium text-theme-text-secondary mb-2">
              {t("modal.issue")}
            </label>
            <textarea
              name="issueDescription"
              value={formData.issueDescription}
              onChange={handleInputChange}
              required
              rows="4"
              className="w-full bg-theme-surface border border-theme-border rounded-lg px-4 py-3 text-theme-text placeholder-theme-text-tertiary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t("modal.issue_ph")}
            />
          </div>

          {/* Image Upload */}
          <div>
            <h3 className="text-lg font-semibold text-theme-text border-b border-theme-border pb-2 mb-4">
              <i className="fas fa-camera mr-2"></i>
              {t("modal.attach_photo")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-theme-text-secondary mb-2">
                  {t("modal.upload_device")}
                </label>
                <div className="border-2 border-dashed border-theme-border rounded-lg p-6 text-center bg-white/5 hover:bg-white/10 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <i className="fas fa-cloud-upload-alt text-3xl text-theme-text-tertiary mb-2 block"></i>
                    <p className="text-theme-text/80">
                      {t("modal.click_upload")}
                    </p>
                    <p className="text-theme-text-tertiary text-sm">
                      {t("user.file_hint")}
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-text-secondary mb-2">
                  {t("modal.or_paste_url")}
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={handleImageUrlChange}
                  className="w-full bg-theme-surface border border-theme-border rounded-lg px-4 py-3 text-theme-text placeholder-theme-text-tertiary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-theme-text-secondary mb-2">
                  {t("modal.preview")}
                </p>
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-xs max-h-48 rounded-lg border border-theme-border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setSelectedFile(null);
                      setFormData((prev) => ({ ...prev, imageUrl: "" }));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-theme-text rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Operator Assignment */}
          {contacts && contacts.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-theme-text-secondary mb-2">
                {t("modal.operator_optional")}
              </label>
              <select
                name="assignToOperator"
                value={formData.assignToOperator}
                onChange={handleInputChange}
                className="w-full bg-theme-surface border border-theme-border rounded-lg px-4 py-3 text-theme-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{t("modal.operator_select")}</option>
                {contacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-theme-border">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-theme-text font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  {t("modal.create")}
                </>
              ) : (
                <>
                  <i className="fas fa-plus mr-2"></i>
                  {t("modal.create")}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-theme-surface hover:bg-white/30 text-theme-text font-medium rounded-lg transition-colors"
            >
              {t("modal.cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RequestCreateModal;
