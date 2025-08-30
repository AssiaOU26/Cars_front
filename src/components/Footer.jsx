import React from "react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="w-full mt-10">
      <div className="container mx-auto px-6">
        <div className="ios-card p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="ios-header-brand flex items-center justify-center w-14 h-14">
                <i className="fas fa-car-burst text-white text-xl"></i>
              </div>
              <div>
                <div className="text-theme-text font-bold text-xl">
                  {t("brand")}
                </div>
                <p className="text-theme-text-secondary text-sm max-w-md font-medium">
                  {t("footer.body")}
                </p>
              </div>
            </div>

            <div className="text-theme-text-secondary text-sm text-center md:text-right">
              <div className="font-semibold">
                &copy; {new Date().getFullYear()} — {t("footer.rights")}
              </div>
              <div className="text-xs opacity-80 mt-2 font-medium">
                {t("footer.made")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
