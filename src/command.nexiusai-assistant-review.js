const vscode = require('vscode');
const {callOpenAiApi, getConfig, showErrorModal} = require('./nexiusai-global');


function registerDisposableNexiusAIReview(context, l10nConfig) {
    let disposableNexiusAIAssistantReview = vscode.commands.registerCommand('extension.nexiusaiassistantReview', async function () {
        try {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage(l10nConfig.t('errorNoActiveEditor'));
                return;
            }
            const reviewerPrompt = await getConfig(l10nConfig.t('errorNoCodeCheckPrompt'), 'reviewerPrompt', l10nConfig);
            if (reviewerPrompt === '') {
                return
            }
            console.log(reviewerPrompt);
            const documentText = editor.document.getText();
            const userContent = reviewerPrompt.replace('{{code}}', documentText);
            const answer = await callOpenAiApi(context, userContent, l10nConfig);
            if (!answer) {
                return
            }
            const panel = vscode.window.createWebviewPanel(
                'nexiusaiassistantReview',
                l10nConfig.t('infoNexiusAIAssistantReviewResponse'),
                vscode.ViewColumn.Two,
                {
                    enableScripts: true
                }
            );
            panel.webview.html = getWebviewContent(answer);
        } catch (error) {
            const errorText = `${l10nConfig.t('errorFailedToQueryOpenAPI', error.message)}, ${error.response.statusText}`;
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