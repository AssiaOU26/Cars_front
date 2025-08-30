import React, { useState } from "react";
import toast from "react-hot-toast";
import { createRequest } from "../api";
import { useTranslation } from "react-i18next";

// Use centralized API for creating requests (handles token automatically)

function UserView() {
  const [fileName, setFileName] = useState("");
  const { t } = useTranslation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const submitPromise = createRequest(formData);

    await toast.promise(submitPromise, {
      loading: t("modal.create"),
      success: t("user.send"),
      error: t("error.submit_failed", {
        defaultValue: "Failed to submit request. Please try again.",
      }),
    });

    form.reset();
    setFileName("");
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName("");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/15 p-6 md:p-8 rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,.35)]">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        {t("user.submit_title")}
      </h2>
      <div className="text-white/80 text-sm mb-4" id="user-info-hint">
        {/* Show current user basic info if available */}
        {/* This is optional and non-blocking */}
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="userInfo"
            className="block text-sm font-medium text-white/90 mb-1"
          >
            {t("user.info_label")}
          </label>
          <textarea
            id="userInfo"
            name="userInfo"
            required
            rows="4"
            className="w-full bg-white/10 border border-white/25 rounded-lg px-4 py-2.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-white/40"
            placeholder={t("user.info_ph")}
          ></textarea>
        </div>

        {/* New Image URL Field */}
        <div>
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-white/90 mb-1"
          >
            {t("user.image_url")}
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            className="w-full bg-white/10 border border-white/25 rounded-lg px-4 py-2.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="flex items-center justify-center text-white/80">
          <span className="flex-grow border-t border-white/30"></span>
          <span className="mx-4">{t("user.or")}</span>
          <span className="flex-grow border-t border-white/30"></span>
        </div>

        {/* Existing File Upload Field */}
        <div>
          <label
            htmlFor="photo"
            className="block text-sm font-medium text-white/90 mb-1"
          >
            {t("user.upload_photo")}
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/25 border-dashed rounded-lg bg-white/10">
            <div className="space-y-1 text-center">
              <i className="fas fa-camera-retro text-4xl text-white/60"></i>
              <div className="flex text-sm text-white/80">
                <label
                  htmlFor="photo-upload"
                  className="relative cursor-pointer bg-white/20 rounded-md font-medium text-white hover:bg-white/30 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-white/50 px-2"
                >
                  <span>{t("user.upload_file")}</span>
                  <input
                    id="photo-upload"
                    name="photo"
                    onChange={handleFileChange}
                    type="file"
                    className="sr-only"
                    accept="image/*"
                  />
                </label>
              </div>
              <p id="file-name" className="text-xs text-white/60">
                {fileName || t("user.file_hint")}
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
        >
          {t("user.send")}
        </button>
      </form>
    </div>
  );
}

export default UserView;
