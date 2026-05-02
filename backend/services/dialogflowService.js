const dialogflow = require("@google-cloud/dialogflow");
const crypto = require("crypto");
const logger = require("../utils/logger");

const {
  DIALOGFLOW_PROJECT_ID,
  DIALOGFLOW_CLIENT_EMAIL,
  DIALOGFLOW_PRIVATE_KEY,
  DIALOGFLOW_LANGUAGE_CODE,
  DIALOGFLOW_SESSION_ID,
} = require("../config");

const isDialogflowConfigured = () =>
  Boolean(DIALOGFLOW_PROJECT_ID && DIALOGFLOW_CLIENT_EMAIL && DIALOGFLOW_PRIVATE_KEY);

const buildClient = () =>
  new dialogflow.SessionsClient({
    credentials: {
      client_email: DIALOGFLOW_CLIENT_EMAIL,
      private_key: DIALOGFLOW_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
  });

const resolveSessionId = () => DIALOGFLOW_SESSION_ID || crypto.randomUUID();

/**
 * Detects intent using Dialogflow ES.
 * @param {string} text
 * @param {string} languageCode
 * @returns {Promise<null|{intent: string, confidence: number, fulfillmentText: string}>}
 */
const detectDialogflowIntent = async (text, languageCode = "en") => {
  if (!isDialogflowConfigured()) {
    return null;
  }

  try {
    const client = buildClient();
    const sessionPath = client.projectAgentSessionPath(
      DIALOGFLOW_PROJECT_ID,
      resolveSessionId()
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text,
          languageCode: languageCode || DIALOGFLOW_LANGUAGE_CODE || "en",
        },
      },
    };

    const responses = await client.detectIntent(request);
    const result = responses?.[0]?.queryResult;
    const intentName = result?.intent?.displayName;
    if (!intentName) {
      return null;
    }

    return {
      intent: intentName,
      confidence: result.intentDetectionConfidence || 0,
      fulfillmentText: result.fulfillmentText || "",
    };
  } catch (error) {
    logger.warn("Dialogflow intent detection failed", { error: error.message });
    return null;
  }
};

module.exports = { detectDialogflowIntent };
