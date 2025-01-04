const vscode = require('vscode');

function registerDisposableNexiusAIConfigureOpenAIKey(context) {
    let disposableNexiusAIConfigureOpenAIKey = vscode.commands.registerCommand('extension.nexiusaiassistantConfigureOpenAIKey', async function () {
        const secretStorage = context.secrets;
        const storedOpenAIApiKey = await vscode.window.showInputBox({
            prompt: 'Please provide your OpenAI API key (the key will be stored securely)',
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