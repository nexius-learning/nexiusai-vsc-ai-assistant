const vscode = require('vscode');

function registerDisposableNexiusAIConfigureOpenAIKey(context, l10nConfig) {
    let disposableNexiusAIConfigureOpenAIKey = vscode.commands.registerCommand('extension.nexiusaiassistantConfigureOpenAIKey', async function () {
        const secretStorage = context.secrets;
        const storedOpenAIApiKey = await vscode.window.showInputBox({
            prompt: l10nConfig.t('inputPleaseProvideOpenAIKey'),
            password: true,
            ignoreFocusOut: true,
        });
        if (!storedOpenAIApiKey) {
            return
        }
        await secretStorage.store('nexiusaiassistantSettings.openAIApiKey', storedOpenAIApiKey);
    });
    context.subscriptions.push(disposableNexiusAIConfigureOpenAIKey);
}

module.exports = registerDisposableNexiusAIConfigureOpenAIKey;