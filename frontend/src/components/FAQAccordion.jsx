import { memo, useMemo, useState } from "react";

const normalize = (value) => value.toLowerCase();

const FAQAccordion = ({ faq, loading }) => {
  const [query, setQuery] = useState("");

  const filteredFaq = useMemo(() => {
    if (!query.trim()) {
      return faq;
    }
    const normalized = normalize(query);
    return faq.filter((item) => {
      const haystack = [item.question, item.answer, ...(item.keywords || [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [faq, query]);

  if (loading) {
    return <div className="card">Loading FAQs...</div>;
  }

  return (
    <div className="faq-list">
      <label className="faq-search" htmlFor="faq-search">
        Search FAQs
      </label>
      <input
        id="faq-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setQuery("");
          }
        }}
        placeholder="Search by keyword"
        aria-label="Search FAQs"
      />
      {filteredFaq.length === 0 && <div className="card">No matching FAQs found.</div>}
      {filteredFaq.map((item) => (
        <details key={item.id || item.question} className="faq-item">
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
};

export default memo(FAQAccordion);
