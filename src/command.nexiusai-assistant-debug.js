const vscode = require('vscode');

function registerDisposableNexiusAIDebug(context, l10nConfig) {
    let disposableNexiusAIAssistantDebut = vscode.commands.registerCommand('extension.nexiusaiassistantDebug', async function () {
        console.log('errorNoActiveEditor');
        vscode.window.showInformationMessage(l10nConfig.t('errorNoActiveEditor'));
    });
    context.subscriptions.push(disposableNexiusAIAssistantDebut);
}


module.exports = registerDisposableNexiusAIDebug;