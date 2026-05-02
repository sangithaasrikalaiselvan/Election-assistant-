class GoogleGenerativeAI {
  getGenerativeModel() {
    return {
      generateContent: async () => ({ response: { text: () => "" } }),
      generateContentStream: async () => ({ stream: [] }),
    };
  }
}

module.exports = { GoogleGenerativeAI };
