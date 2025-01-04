const vscode = require('vscode');
const {callOpenAiApi, getConfig, showErrorModal} = require('./nexiusai-global');

function registerDisposableNexiusAIReview(context) {
    let disposableNexiusAIAssistantReview = vscode.commands.registerCommand('extension.nexiusaiassistantReview', async function () {
        try {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor found. Please open a file to send its content.');
                return;
            }
            const reviewerPrompt = await getConfig('No code check prompt found. Please set the code check prompt in the settings.', 'reviewerPrompt');
            if (reviewerPrompt === '') {
                return
            }
            console.log(reviewerPrompt);
            const documentText = editor.document.getText();
            const userContent = reviewerPrompt.replace('{{code}}', documentText);
            const answer = await callOpenAiApi(context, userContent);
            if (!answer) {
                return
            }
            const panel = vscode.window.createWebviewPanel(
                'nexiusaiassistantReview',
                'Nexius AI Assistant Review Response',
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
    context.subscriptions.push(disposableNexiusAIAssistantReview);
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

module.exports = registerDisposableNexiusAIReview;