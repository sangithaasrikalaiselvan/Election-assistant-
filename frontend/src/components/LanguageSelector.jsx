import { memo } from "react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Espanol" },
  { code: "fr", label: "Francais" },
];

const LanguageSelector = ({ language, onChange }) => (
  <div className="language-selector">
    <label htmlFor="language" className="visually-hidden">
      Select language
    </label>
    <select
      id="language"
      value={language}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Select language"
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  </div>
);

export default memo(LanguageSelector);
