import { memo } from "react";
import { LANGUAGES } from "../utils/constants";

/**
 * Renders a dropdown to select the preferred language.
 * @param {{ language: string, onChange: (lang: string) => void }} props
 */
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
