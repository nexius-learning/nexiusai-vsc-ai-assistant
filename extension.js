const registerDisposableNexiusAIAssistantGenerateUnitTest = require('./command.nexiusai-assistant-generate-unit-test');
const registerDisposableNexiusAIAssistantCodeCheck = require('./command.nexiusai-assistant-code-check');

function activate(context) {
    registerDisposableNexiusAIAssistantGenerateUnitTest(context);
    registerDisposableNexiusAIAssistantCodeCheck(context);
}

function deactivate() {
}

module.exports = {
    activate,
    deactivate
};
