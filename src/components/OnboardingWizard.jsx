import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

function SkillChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 bg-white/10 border border-white/20 text-white text-xs font-medium px-2 py-1 rounded-full">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="opacity-80 hover:opacity-100"
      >
        <i className="fas fa-times text-[10px]"></i>
      </button>
    </span>
  );
}

const hourlyOptions = [
  "$20 - $40/hr",
  "$40 - $80/hr",
  "$80 - $120/hr",
  "$120 - $200/hr",
];

export default function OnboardingWizard({ onClose }) {
  const { themeConfig } = useTheme();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [oneLiner, setOneLiner] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillDraft, setSkillDraft] = useState("");
  const [hourly, setHourly] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [links, setLinks] = useState(["", ""]);

  const canAddSkill = useMemo(
    () => skills.length < 3 && skillDraft.trim().length > 0,
    [skills, skillDraft]
  );

  const addSkill = () => {
    if (!canAddSkill) return;
    setSkills((prev) => Array.from(new Set([...prev, skillDraft.trim()])));
    setSkillDraft("");
  };

  const handlePhoto = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(String(ev.target?.result || ""));
    reader.readAsDataURL(file);
  };

  const goNext = () => setStep((s) => Math.min(2, s + 1));
  const goPrev = () => setStep((s) => Math.max(1, s - 1));

  const complete = () => {
    try {
      const data = {
        oneLiner,
        skills,
        hourly,
        links,
        photoPreview,
        completedAt: Date.now(),
      };
      localStorage.setItem("onboarding.profile", JSON.stringify(data));
      localStorage.setItem("onboardingCompleted", "true");
    } catch {}
    onClose?.();
  };

  useEffect(() => {
    const cached = localStorage.getItem("onboarding.profile");
    if (cached) {
      try {
        const json = JSON.parse(cached);
        setOneLiner(json.oneLiner || "");
        setSkills(Array.isArray(json.skills) ? json.skills.slice(0, 3) : []);
        setHourly(json.hourly || "");
        setLinks(Array.isArray(json.links) ? json.links.slice(0, 2) : ["", ""]);
        setPhotoPreview(json.photoPreview || "");
      } catch {}
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      <div
        className={`relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6`}
      >
        {/* Left Panel: Form steps */}
        <div
          className={`elevated-card bg-gradient-to-br ${themeConfig.cardBg} border p-6 md:p-10`}
        >
          {step === 1 && (
            <div>
              <div className="text-xs uppercase tracking-wide text-white/70 mb-2">
                {t("onboarding.step")} 1/2
              </div>
              <h2 className="text-3xl font-bold text-white mb-6">
                {t("onboarding.build_profile")}
              </h2>

              <label className="block text-sm text-white/80 mb-2">
                {t("onboarding.one_liner")}
              </label>
              <textarea
                rows={3}
                value={oneLiner}
                onChange={(e) => setOneLiner(e.target.value.slice(0, 60))}
                placeholder={t("onboarding.one_liner_ph")}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/60 mb-6"
              />

              <label className="block text-sm text-white/80 mb-2">
                {t("onboarding.skills")}
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  value={skillDraft}
                  onChange={(e) => setSkillDraft(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" ? (e.preventDefault(), addSkill()) : null
                  }
                  placeholder={t("onboarding.skill_ph")}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/60"
                />
                <button
                  type="button"
                  disabled={!canAddSkill}
                  onClick={addSkill}
                  className={`px-3 py-2 rounded-lg text-sm text-white ${
                    canAddSkill
                      ? "bg-orange-600 hover:bg-orange-700"
                      : "bg-white/10"
                  }`}
                >
                  {t("onboarding.add")}
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {skills.map((s) => (
                  <SkillChip
                    key={s}
                    label={s}
                    onRemove={() =>
                      setSkills((prev) => prev.filter((x) => x !== s))
                    }
                  />
                ))}
                {skills.length === 0 && (
                  <span className="text-white/50 text-xs">
                    {t("onboarding.up_to_three")}
                  </span>
                )}
              </div>

              <label className="block text-sm text-white/80 mb-2">
                {t("onboarding.rate")}
              </label>
              <div className="mb-6">
                <select
                  value={hourly}
                  onChange={(e) => setHourly(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-3 text-white"
                >
                  <option value="" className="bg-slate-900">
                    {t("onboarding.select_rate")}
                  </option>
                  {hourlyOptions.map((o) => (
                    <option className="bg-slate-900" key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              <label className="block text-sm text-white/80 mb-2">
                {t("onboarding.photo")}
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-white/10 border border-white/20 flex items-center justify-center">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <i className="fas fa-user text-white/40"></i>
                  )}
                </div>
                <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-2 rounded-lg border border-white/20">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhoto}
                  />
                  {t("onboarding.upload_photo")}
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-10">
                <button
                  type="button"
                  onClick={goNext}
                  className="px-5 py-2.5 rounded-lg text-white bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 shadow-lg"
                >
                  {t("onboarding.continue")}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="text-xs uppercase tracking-wide text-white/70 mb-2">
                {t("onboarding.step")} 2/2
              </div>
              <h2 className="text-3xl font-bold text-white mb-6">
                {t("onboarding.add_links")}
              </h2>

              <div className="space-y-4">
                {[0, 1].map((i) => (
                  <div key={i}>
                    <label className="block text-sm text-white/80 mb-2">
                      {i === 0
                        ? t("onboarding.link_1")
                        : t("onboarding.link_2")}
                    </label>
                    <input
                      type="url"
                      placeholder={t("onboarding.link_ph")}
                      value={links[i]}
                      onChange={(e) =>
                        setLinks((prev) =>
                          prev.map((v, idx) => (idx === i ? e.target.value : v))
                        )
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/60"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-10">
                <button
                  type="button"
                  onClick={goPrev}
                  className="px-5 py-2.5 rounded-lg text-white/80 bg-white/10 hover:bg-white/20 border border-white/20"
                >
                  {t("onboarding.back")}
                </button>
                <button
                  type="button"
                  onClick={complete}
                  className="px-5 py-2.5 rounded-lg text-white bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg"
                >
                  {t("onboarding.complete")}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Live profile preview */}
        <div
          className={`elevated-card bg-gradient-to-br ${themeConfig.cardBg} border p-6 md:p-10 flex items-center`}
        >
          <div className="w-full max-w-sm mx-auto">
            <div className="mx-auto w-28 h-28 rounded-full overflow-hidden bg-white/10 border border-white/20 flex items-center justify-center mb-4">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <i className="fas fa-user text-white/40 text-3xl"></i>
              )}
            </div>
            <h3 className="text-2xl font-semibold text-white text-center mb-2">
              {t("onboarding.preview_name")}
            </h3>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {skills.map((s) => (
                <span
                  key={s}
                  className="text-xs font-medium px-2 py-1 rounded-full bg-white/10 border border-white/20 text-white/90"
                >
                  {s}
                </span>
              ))}
              {hourly && (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                  {hourly}
                </span>
              )}
            </div>
            <div className="text-center text-white/80 text-sm min-h-[40px] mb-6">
              {oneLiner || t("onboarding.preview_oneliner")}
            </div>

            <div className="space-y-3">
              {links.filter(Boolean).map((l, idx) => (
                <a
                  key={idx}
                  target="_blank"
                  rel="noreferrer"
                  href={l}
                  className="block w-full text-center px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white/90 hover:bg-white/20 truncate"
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
