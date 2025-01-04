const registerDisposableNexiusAIAssistantCodeCheck = require('./src/command.nexiusai-assistant-review');
const registerDisposableNexiusAIConfigureOpenAIKey = require("./src/command.nexiusai-assistant-openai-key");


function activate(context) {
    registerDisposableNexiusAIAssistantCodeCheck(context);
    registerDisposableNexiusAIConfigureOpenAIKey(context);
}

function deactivate() {
}

module.exports = {
    activate,
    deactivate
};
