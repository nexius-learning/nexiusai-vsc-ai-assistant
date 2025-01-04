const registerDisposableNexiusAIAssistantGenerateUnitTest = require('./command.nexiusai-assistant-generate-unit-test');
const registerDisposableNexiusAIAssistantCodeCheck = require('./command.nexiusai-assistant-code-check');
const registerDisposableNexiusAIAssistantTest = require("./command.nexiusai-assistant-test");

function activate(context) {
    registerDisposableNexiusAIAssistantGenerateUnitTest(context);
    registerDisposableNexiusAIAssistantCodeCheck(context);
    registerDisposableNexiusAIAssistantTest(context);
}

function deactivate() {
}

module.exports = {
    activate,
    deactivate
};
