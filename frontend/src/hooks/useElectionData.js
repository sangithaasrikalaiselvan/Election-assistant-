/**
 * @fileoverview Custom hook to fetch election guide and FAQ data
 */
import { useState, useEffect } from "react";
import { fetchFaq, fetchGuide } from "../services/api";

/**
 * Hook to manage fetching and caching of election guide and FAQ data.
 * @returns {{ guideSteps: Array, faq: Array, loading: boolean }}
 */
export const useElectionData = () => {
  const [guideSteps, setGuideSteps] = useState([]);
  const [faq, setFaq] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [guideData, faqData] = await Promise.all([fetchGuide(), fetchFaq()]);

        if (isMounted) {
          setGuideSteps(guideData.steps || []);
          setFaq(faqData.faq || []);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load election data:", error);
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

  return { guideSteps, faq, loading };
};
