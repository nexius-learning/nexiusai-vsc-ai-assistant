const vscode = require('vscode');
const axios = require('axios');
const { showErrorNoSetting } = require('./nexiusai-global');
function registerDisposableNexiusAIAssistantCodeCheck(context) {
let disposableNexiusAIAssistantCodeCheck = vscode.commands.registerCommand('extension.nexiusaiassistantCodeCheck', async function () {
    try {
        const panel = vscode.window.createWebviewPanel(
            'nexiusaiassistantCodeCheck',
            'Nexius AI Assistant Code Check Response',
            vscode.ViewColumn.Two,
            {
                enableScripts: true
            }
        );
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found. Please open a file to send its content.');
            return;
        }
        const configuration = vscode.workspace.getConfiguration('nexiusaiassistantSettings');
        const openAiApiKey = configuration.get('openaiapiKey', '');
        if (openAiApiKey==='') {
            await showErrorNoSetting('No OpenAI API key found. Please set your OpenAI API key in the settings.','nexiusaiassistantSettings.openaiapiKey');
            return;
        }
        const codeCheckPrompt = configuration.get('codeCheckPrompt', '').toString();
        if (codeCheckPrompt==='') {
            await showErrorNoSetting('No code check prompt found. Please set the code check prompt in the settings.','nexiusaiassistantSettings.codeCheckPrompt');
            return;
        }
        const documentText = editor.document.getText();
        const userContent = codeCheckPrompt.replace('{{code}}',documentText);
        vscode.window.showInformationMessage(`OpenAI's starting...`);
        const response = await axios.post('https://api.openai.com/v1/chat/completions', 
            {
                "model": "gpt-4o-mini",
                "messages": [
                    {
                        "role": "user",
                        "content": userContent
                    }
                ],
            }, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openAiApiKey}`
                }
            }
        );
        vscode.window.showInformationMessage(`OpenAI's response received...`);
        const answer = response.data.choices[0].message.content;
        panel.webview.html = getWebviewContent(answer);

        } catch (error) {
            console.log(error)
            vscode.window.showErrorMessage(`Failed to query OpenAI API: ${error.message}`);
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