const registerDisposableNexiusAIAssistantCodeCheck = require('./command.nexiusai-assistant-code-check');


function activate(context) {
    registerDisposableNexiusAIAssistantCodeCheck(context);
}

function deactivate() {
}

module.exports = {
    activate,
    deactivate
};
