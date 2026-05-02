class OpenRouter {
  constructor() {
    this.chat = {
      send: async () => ({ choices: [{ message: { content: "" } }] }),
    };
  }
}

module.exports = { OpenRouter };
