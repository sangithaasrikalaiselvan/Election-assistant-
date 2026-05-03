import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";
import LanguageSelector from "../components/LanguageSelector";
import { useElectionData } from "../hooks/useElectionData";
import { UI_COPY, STORAGE_KEY } from "../utils/constants";

const ChatBox = lazy(() => import("../components/ChatBox"));
const StepGuide = lazy(() => import("../components/StepGuide"));
const ElectionTimeline = lazy(() => import("../components/ElectionTimeline"));
const FAQAccordion = lazy(() => import("../components/FAQAccordion"));

/**
 * Main application dashboard rendering all election-related components.
 */
const HomePage = () => {
  const [language, setLanguage] = useState("en");
  const { guideSteps, faq, loading } = useElectionData();

  useEffect(() => {
    const storedLanguage = localStorage.getItem(STORAGE_KEY);
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
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
