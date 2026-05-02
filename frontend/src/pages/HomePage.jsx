import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";
import LanguageSelector from "../components/LanguageSelector";
import { fetchFaq, fetchGuide } from "../services/api";

const ChatBox = lazy(() => import("../components/ChatBox"));
const StepGuide = lazy(() => import("../components/StepGuide"));
const ElectionTimeline = lazy(() => import("../components/ElectionTimeline"));
const FAQAccordion = lazy(() => import("../components/FAQAccordion"));

const UI_COPY = {
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
    heroTagline: "Guia clara y paso a paso para cada fase electoral.",
    chatTitle: "Asistente Interactivo",
    guideTitle: "Guia Paso a Paso",
    timelineTitle: "Linea de Tiempo Electoral",
    faqTitle: "Preguntas Frecuentes",
  },
  fr: {
    heroTitle: "Assistant Electoral",
    heroTagline: "Guide clair et progressif pour chaque phase electorale.",
    chatTitle: "Assistant Interactif",
    guideTitle: "Guide Etape par Etape",
    timelineTitle: "Chronologie Electorale",
    faqTitle: "Questions Frequentes",
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

const STORAGE_KEY = "preferredLanguage";

const HomePage = () => {
  const [language, setLanguage] = useState("en");
  const [guideSteps, setGuideSteps] = useState([]);
  const [faq, setFaq] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedLanguage = localStorage.getItem(STORAGE_KEY);
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [guideData, faqData] = await Promise.all([fetchGuide(), fetchFaq()]);

        if (isMounted) {
          setGuideSteps(guideData.steps || []);
          setFaq(faqData.faq || []);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const copy = useMemo(() => UI_COPY[language] || UI_COPY.en, [language]);
  const handleLanguageChange = useCallback((value) => setLanguage(value), []);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="hero">
        <div className="hero-content">
          <p className="hero-kicker">Civic Clarity Toolkit</p>
          <h1>{copy.heroTitle}</h1>
          <p className="hero-tagline">{copy.heroTagline}</p>
        </div>
        <LanguageSelector language={language} onChange={handleLanguageChange} />
      </header>

      <main id="main" className="main-content">
        <section className="section" aria-labelledby="chat-heading">
          <div className="section-header">
            <h2 id="chat-heading">{copy.chatTitle}</h2>
            <p>Ask questions and get structured guidance instantly.</p>
          </div>
          <Suspense fallback={<div className="card">Loading assistant...</div>}>
            <ChatBox language={language} />
          </Suspense>
        </section>

        <section className="section" aria-labelledby="guide-heading">
          <div className="section-header">
            <h2 id="guide-heading">{copy.guideTitle}</h2>
            <p>Move through each stage with next-step clarity.</p>
          </div>
          <Suspense fallback={<div className="card">Loading guide...</div>}>
            <StepGuide steps={guideSteps} loading={loading} />
          </Suspense>
        </section>

        <section className="section" aria-labelledby="timeline-heading">
          <div className="section-header">
            <h2 id="timeline-heading">{copy.timelineTitle}</h2>
            <p>A structured view of key dates and milestones.</p>
          </div>
          <Suspense fallback={<div className="card">Loading timeline...</div>}>
            <ElectionTimeline />
          </Suspense>
        </section>

        <section className="section" aria-labelledby="faq-heading">
          <div className="section-header">
            <h2 id="faq-heading">{copy.faqTitle}</h2>
            <p>Common questions answered with concise guidance.</p>
          </div>
          <Suspense fallback={<div className="card">Loading FAQs...</div>}>
            <FAQAccordion faq={faq} loading={loading} />
          </Suspense>
        </section>
      </main>
      <footer className="footer">Built for clarity, accessibility, and trust.</footer>
    </div>
  );
};

export default HomePage;
