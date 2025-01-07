const registerDisposableNexiusAIAssistantCodeCheck = require('./src/command.nexiusai-assistant-review');
const registerDisposableNexiusAIConfigureOpenAIKey = require("./src/command.nexiusai-assistant-openai-key");
const l10n = require("@vscode/l10n");
const vscode = require('vscode');
const fs = require('fs');

async function activate(context) {
    const language = vscode.env.language;
    let languageFile = context.asAbsolutePath(`./i18n/${language}.json`);
    if (!fs.existsSync(languageFile)) {
        languageFile = context.asAbsolutePath(`./i18n/en.json`);
    }
    await l10n.config({
        fsPath: languageFile
    });
    registerDisposableNexiusAIAssistantCodeCheck(context, l10n);
    registerDisposableNexiusAIConfigureOpenAIKey(context, l10n);
}

function deactivate() {
}

module.exports = {
    activate,
    deactivate
};
