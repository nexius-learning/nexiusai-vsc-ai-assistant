const vscode = require('vscode');
const {callOpenAiApi, getConfig, showErrorModal} = require('./nexiusai-global');

function registerDisposableNexiusAIAssistantCodeCheck(context) {
    let disposableNexiusAIAssistantCodeCheck = vscode.commands.registerCommand('extension.nexiusaiassistantCodeCheck', async function () {
        try {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor found. Please open a file to send its content.');
                return;
            }
            const codeCheckPrompt = await getConfig('No code check prompt found. Please set the code check prompt in the settings.', 'codeCheckPrompt');
            if (codeCheckPrompt === '') {
                return
            }
            const documentText = editor.document.getText();
            const userContent = codeCheckPrompt.replace('{{code}}', documentText);
            vscode.window.showInformationMessage(`OpenAI's starting...`);
            const answer = await callOpenAiApi(userContent);
            const panel = vscode.window.createWebviewPanel(
                'nexiusaiassistantCodeCheck',
                'Nexius AI Assistant Code Check Response',
                vscode.ViewColumn.Two,
                {
                    enableScripts: true
                }
            );
            panel.webview.html = getWebviewContent(answer);
        } catch (error) {
            const errorText = `Failed to query OpenAI API: ${error.message} , ${error.response.statusText}`;
            await showErrorModal(errorText);
            vscode.window.showErrorMessage(errorText);
        }
    });
    context.subscriptions.push(disposableNexiusAIAssistantCodeCheck);
}

function getWebviewContent(answer) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OpenAI Response</title>
        </head>
        <body>
            ${answer}
        </body>
        </html>
    `;
}

module.exports = registerDisposableNexiusAIAssistantCodeCheck;