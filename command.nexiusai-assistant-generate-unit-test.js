const vscode = require('vscode');
const axios = require('axios');
const { showErrorNoSetting } = require('./nexiusai-global');
function registerDisposableNexiusAIAssistantGenerateUnitTest(context) {
let disposableNexiusAIAssistantGenerateUnitTest = vscode.commands.registerCommand('extension.nexiusaiassistantGenerateUnitTest', async function () {
    try {
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
        const unitTestPrompt = configuration.get('unitTestPrompt', '').toString();
        if (unitTestPrompt==='') {
            await showErrorNoSetting('No unit test prompt found. Please set the unit test prompt in the settings.','nexiusaiassistantSettings.unitTestPrompt');
            return;
        }
        const documentText = editor.document.getText();
        const userContent = unitTestPrompt.replace('{{code}}',documentText);
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
        const newDocument = await vscode.workspace.openTextDocument(
            {
                content: answer,
                language: 'typescript' // You can adjust the language as needed
            }
        );
        await vscode.window.showTextDocument(newDocument);
        } catch (error) {
            console.log(error)
            vscode.window.showErrorMessage(`Failed to query OpenAI API: ${error.message}`);
        }
    });
    context.subscriptions.push(disposableNexiusAIAssistantGenerateUnitTest);
}
module.exports = registerDisposableNexiusAIAssistantGenerateUnitTest;