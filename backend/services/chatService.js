const { detectIntent } = require("../utils/intent");
const { detectDialogflowIntent } = require("./dialogflowService");
const { getGeminiResponse, getGeminiStream } = require("./geminiService");
const { translateText } = require("./translateService");
const SimpleCache = require("../utils/cache");
const { CACHE_TTL_MS } = require("../config");
const { getGuideSteps, getTimeline, findFaqByKeyword } = require("./knowledgeService");

const responseCache = new SimpleCache(CACHE_TTL_MS);

const FLOW_STEPS = [
  "Voter Registration",
  "Nomination",
  "Campaigning",
  "Voting Day",
  "Vote Counting",
  "Results",
];

const STEP_ORDER = {
  registration: 1,
  nomination: 2,
  campaigning: 3,
  voting: 4,
  counting: 5,
  results: 6,
};

const SYSTEM_PROMPT = `You are an AI-powered Election Assistant designed to help users understand the election process in a clear, structured, and interactive way.\n\nYour goal is to help users learn about elections step-by-step, answer questions clearly, and guide them through the full election lifecycle.\n\nElection flow (strict order): Voter Registration, Nomination, Campaigning, Voting Day, Vote Counting, Results.\n\nRespond using this exact format with headings:\nDirect Answer: <short and clear>\nSimple Explanation: <easy to understand>\nStep-by-Step Breakdown: <use bullet points if applicable, otherwise say 'Not applicable'>\nNext Step Guidance: <suggest what the user can do next>\n\nBe friendly, simple, and informative. Avoid complex political or legal jargon. Use bullet points where helpful. Keep responses concise but structured.\n\nIf user asks about a specific step, explain that step and mention where it fits in the process. If user asks generally, show full election flow. Always encourage continuation: "Would you like to continue to the next step?"\n\nIf dates are mentioned, explain which phase is active and indicate whether it is COMPLETED, ACTIVE, or UPCOMING.\n\nDo not generate political opinions or bias. Stay neutral and educational.`;

const INTENT_ALIASES = {
  registration: "registration",
  nomination: "nomination",
  campaigning: "campaigning",
  voting_day: "voting",
  voting: "voting",
  vote_counting: "counting",
  counting: "counting",
  results: "results",
  timeline: "timeline",
  steps: "steps",
  faq: "faq",
  guide: "steps",
};

const normalizeIntentName = (name) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z_]/g, "");

const resolveIntent = async (message, language) => {
  const dialogflowResult = await detectDialogflowIntent(message, language);
  if (dialogflowResult?.intent) {
    const normalized = normalizeIntentName(dialogflowResult.intent);
    const mapped = INTENT_ALIASES[normalized];
    if (mapped && normalized !== "default_fallback_intent") {
      return mapped;
    }
  }

  return detectIntent(message);
};

const parseDate = (value) => new Date(`${value}T00:00:00`);

const getPhaseStatus = (today, startDate, endDate) => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (today > end) {
    return "COMPLETED";
  }
  if (today >= start && today <= end) {
    return "ACTIVE";
  }
  return "UPCOMING";
};

const buildFlowList = () => FLOW_STEPS.map((step) => `- ${step}`).join("\n");

const isFaqQuery = (message) =>
  /\b(faq|question|help|support)\b/i.test(String(message || ""));

const buildStepBreakdown = (intent) => {
  const stepsByIntent = {
    registration: [
      "Check eligibility requirements",
      "Complete the registration form",
      "Submit identity verification",
    ],
    nomination: [
      "Confirm candidate eligibility",
      "Submit nomination paperwork",
      "Receive ballot approval",
    ],
    campaigning: [
      "Share policy priorities",
      "Engage voters through outreach",
      "Participate in debates",
    ],
    voting: [
      "Confirm your polling location",
      "Bring required identification",
      "Cast your ballot securely",
    ],
    counting: [
      "Secure ballots for counting",
      "Tally votes with oversight",
      "Run verification checks",
    ],
    results: [
      "Review certified results",
      "Confirm winning candidates",
      "Publish official announcements",
    ],
  };

  return stepsByIntent[intent] || [];
};

const buildNextStepPrompt = (intent) => {
  const order = STEP_ORDER[intent];
  if (!order) {
    return "Would you like to start with Voter Registration?";
  }
  if (order >= FLOW_STEPS.length) {
    return "Would you like to review the full election flow again?";
  }
  return `Would you like to continue to the next step: ${FLOW_STEPS[order]}?`;
};

const buildTimelineStatusLine = (message) => {
  const shouldInclude = /\b(date|when|timeline|schedule)\b/i.test(message);
  if (!shouldInclude) {
    return null;
  }

  const today = new Date();
  const activePhase = getTimeline().find(
    (phase) => getPhaseStatus(today, phase.startDate, phase.endDate) === "ACTIVE"
  );

  if (!activePhase) {
    return "Timeline status: No active phase today.";
  }

  const status = getPhaseStatus(today, activePhase.startDate, activePhase.endDate);

  return `Timeline status: ${activePhase.phase} is ${status}.`;
};

const formatStructuredAnswer = ({ intent, direct, explanation, message }) => {
  const breakdown = buildStepBreakdown(intent);
  const timelineLine = buildTimelineStatusLine(message);
  const parts = [`Direct Answer: ${direct}`, `Simple Explanation: ${explanation}`];

  if (timelineLine) {
    parts.push(`Timeline Status: ${timelineLine.replace("Timeline status: ", "")}`);
  }

  if (breakdown.length) {
    parts.push(
      `Step-by-Step Breakdown:\n${breakdown.map((item) => `- ${item}`).join("\n")}`
    );
    parts.push(
      `Next Step Guidance: This is step ${STEP_ORDER[intent]} of ${FLOW_STEPS.length}. ${buildNextStepPrompt(intent)}`
    );
  } else if (intent === "steps" || intent === "general") {
    parts.push(`Step-by-Step Breakdown:\n${buildFlowList()}`);
    parts.push(`Next Step Guidance: ${buildNextStepPrompt(intent)}`);
  } else {
    parts.push("Step-by-Step Breakdown: Not applicable.");
    parts.push(`Next Step Guidance: ${buildNextStepPrompt(intent)}`);
  }
  return parts.filter(Boolean).join("\n\n");
};

/**
 * Builds a structured response using Dialogflow intent detection and fallback.
 * @param {string} message
 * @param {string} language
 * @returns {Promise<{intent: string, answer: string, sources: string[]}>}
 */
const buildResponse = async (message, language) => {
  const resolvedIntent = await resolveIntent(message, language);
  const intent = isFaqQuery(message) ? "faq" : resolvedIntent;
  const faqMatch = findFaqByKeyword(message);

  if (intent === "faq" && faqMatch) {
    return {
      intent: "faq",
      answer: formatStructuredAnswer({
        intent: "faq",
        direct: faqMatch.answer,
        explanation: "Here is a simple explanation based on common election guidance.",
        message,
      }),
      sources: ["faq"],
    };
  }

  if (intent === "timeline") {
    return {
      intent,
      answer: formatStructuredAnswer({
        intent,
        direct: "Here is the election timeline in order.",
        explanation: getTimeline()
          .map((phase) => `${phase.phase}: ${phase.startDate} to ${phase.endDate}`)
          .join(" | "),
        message,
      }),
      sources: ["timeline"],
    };
  }

  if (intent === "steps") {
    return {
      intent,
      answer: formatStructuredAnswer({
        intent,
        direct: "The election process follows a clear 6-step flow.",
        explanation: getGuideSteps()
          .map((step) => step.title)
          .join(" -> "),
        message,
      }),
      sources: ["guide"],
    };
  }

  if (
    [
      "registration",
      "nomination",
      "campaigning",
      "voting",
      "counting",
      "results",
    ].includes(intent)
  ) {
    const step = getGuideSteps().find(
      (item) =>
        item.id === intent || item.keywords?.some((keyword) => keyword.includes(intent))
    );
    if (step) {
      return {
        intent,
        answer: formatStructuredAnswer({
          intent,
          direct: step.description,
          explanation: `This step is part of the election flow: ${FLOW_STEPS.join(", ")}.`,
          message,
        }),
        sources: ["guide"],
      };
    }
  }

  if (intent === "greeting") {
    return {
      intent,
      answer: formatStructuredAnswer({
        intent,
        direct: "Hello! I can guide you through the election process.",
        explanation: "Ask about any step or the full timeline to get started.",
        message,
      }),
      sources: ["general"],
    };
  }

  if (intent === "general") {
    const llmAnswer = await getGeminiResponse(message, SYSTEM_PROMPT);
    if (llmAnswer) {
      return {
        intent: "gemini",
        answer: llmAnswer,
        sources: ["gemini"],
      };
    }
  }

  return {
    intent: "general",
    answer: formatStructuredAnswer({
      intent: "general",
      direct:
        "I can help with registration, nomination, campaigning, voting, results, and FAQs.",
      explanation: "Tell me which step you want to explore, or ask for the full flow.",
      message,
    }),
    sources: ["general"],
  };
};

/**
 * Streams a response for the chat message when possible.
 * @param {string} message
 * @param {string} language
 * @returns {Promise<{intent: string, sources: string[], stream: AsyncGenerator<string>}>}
 */
const getChatResponseStream = async (message, language) => {
  const intent = await resolveIntent(message, language);
  if (intent === "general") {
    const stream = await getGeminiStream(message, SYSTEM_PROMPT);
    if (stream) {
      return {
        intent: "gemini",
        sources: ["gemini"],
        stream,
      };
    }
  }

  const response = await buildResponse(message, language);
  async function* iterate() {
    yield response.answer;
  }

  return {
    intent: response.intent,
    sources: response.sources,
    stream: iterate(),
  };
};

/**
 * Returns a cached or freshly generated response for the chat message.
 * @param {string} message
 * @param {string} language
 * @returns {Promise<{intent: string, answer: string, sources: string[]}>}
 */
const getChatResponse = async (message, language) => {
  const cacheKey = `${language}:${message.trim().toLowerCase()}`;
  const cached = responseCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const response = await buildResponse(message, language);
  if (response.intent !== "gemini") {
    responseCache.set(cacheKey, response);
  }
  return response;
};

const getTranslatedChatResponse = async (message, language) => {
  const response = await getChatResponse(message, language);
  const translatedAnswer = await translateText(response.answer, language);
  return {
    ...response,
    answer: translatedAnswer,
    language,
  };
};

const getTranslatedChatStream = async (message, language) => {
  const response = await getChatResponseStream(message, language);

  async function* iterate() {
    for await (const chunk of response.stream) {
      const translated = await translateText(chunk, language);
      yield translated;
    }
  }

  return {
    intent: response.intent,
    sources: response.sources,
    stream: iterate(),
  };
};

module.exports = {
  getChatResponse,
  getChatResponseStream,
  getTranslatedChatResponse,
  getTranslatedChatStream,
};
