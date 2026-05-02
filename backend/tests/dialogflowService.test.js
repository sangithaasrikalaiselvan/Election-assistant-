jest.mock("@google-cloud/dialogflow", () => ({
  SessionsClient: jest.fn(),
}));

describe("dialogflowService", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns null when not configured", async () => {
    const { detectDialogflowIntent } = require("../services/dialogflowService");
    const result = await detectDialogflowIntent("hello", "en");
    expect(result).toBeNull();
  });

  it("returns intent when configured", async () => {
    process.env.DIALOGFLOW_PROJECT_ID = "project";
    process.env.DIALOGFLOW_CLIENT_EMAIL = "test@example.com";
    process.env.DIALOGFLOW_PRIVATE_KEY = "key";

    const dialogflow = require("@google-cloud/dialogflow");
    dialogflow.SessionsClient.mockImplementation(() => ({
      projectAgentSessionPath: jest.fn(() => "session"),
      detectIntent: jest.fn(async () => [
        {
          queryResult: {
            intent: { displayName: "Voting Day" },
            intentDetectionConfidence: 0.9,
            fulfillmentText: "Details",
          },
        },
      ]),
    }));

    const { detectDialogflowIntent } = require("../services/dialogflowService");
    const result = await detectDialogflowIntent("vote", "en");
    expect(result.intent).toBe("Voting Day");
    expect(result.confidence).toBe(0.9);
  });

  it("returns null when intent is missing", async () => {
    process.env.DIALOGFLOW_PROJECT_ID = "project";
    process.env.DIALOGFLOW_CLIENT_EMAIL = "test@example.com";
    process.env.DIALOGFLOW_PRIVATE_KEY = "key";

    const dialogflow = require("@google-cloud/dialogflow");
    dialogflow.SessionsClient.mockImplementation(() => ({
      projectAgentSessionPath: jest.fn(() => "session"),
      detectIntent: jest.fn(async () => [{ queryResult: {} }]),
    }));

    const { detectDialogflowIntent } = require("../services/dialogflowService");
    const result = await detectDialogflowIntent("vote", "en");
    expect(result).toBeNull();
  });

  it("returns null when dialogflow throws", async () => {
    process.env.DIALOGFLOW_PROJECT_ID = "project";
    process.env.DIALOGFLOW_CLIENT_EMAIL = "test@example.com";
    process.env.DIALOGFLOW_PRIVATE_KEY = "key";

    const dialogflow = require("@google-cloud/dialogflow");
    dialogflow.SessionsClient.mockImplementation(() => ({
      projectAgentSessionPath: jest.fn(() => "session"),
      detectIntent: jest.fn(async () => {
        throw new Error("boom");
      }),
    }));

    const { detectDialogflowIntent } = require("../services/dialogflowService");
    const result = await detectDialogflowIntent("vote", "en");
    expect(result).toBeNull();
  });
});
