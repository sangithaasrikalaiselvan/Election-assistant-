/**
 * @fileoverview Centralized configuration and string constants for the frontend
 */

export const STORAGE_KEY = "preferredLanguage";

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
];

export const UI_COPY = {
  en: {
    heroTitle: "Election Assistant",
    heroTagline: "Clear, step-by-step guidance for every phase of the election.",
    chatTitle: "Interactive Assistant",
    guideTitle: "Step-by-Step Guide",
    timelineTitle: "Election Timeline",
    faqTitle: "Frequently Asked Questions",
  },
  es: {
    heroTitle: "Asistente Electoral",
    heroTagline: "Guía clara y paso a paso para cada fase electoral.",
    chatTitle: "Asistente Interactivo",
    guideTitle: "Guía Paso a Paso",
    timelineTitle: "Línea de Tiempo Electoral",
    faqTitle: "Preguntas Frecuentes",
  },
  fr: {
    heroTitle: "Assistant Électoral",
    heroTagline: "Guide clair et progressif pour chaque phase électorale.",
    chatTitle: "Assistant Interactif",
    guideTitle: "Guide Étape par Étape",
    timelineTitle: "Chronologie Électorale",
    faqTitle: "Questions Fréquentes",
  },
  hi: {
    heroTitle: "Election Assistant",
    heroTagline: "Har charan ke liye saral aur spasht margdarshan.",
    chatTitle: "Interactive Assistant",
    guideTitle: "Step-by-Step Guide",
    timelineTitle: "Election Timeline",
    faqTitle: "Frequently Asked Questions",
  },
};
