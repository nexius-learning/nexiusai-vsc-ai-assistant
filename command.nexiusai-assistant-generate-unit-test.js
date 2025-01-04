const vscode = require('vscode');
const {callOpenAiApi, getConfig, showErrorModal} = require('./nexiusai-global');

function registerDisposableNexiusAIAssistantGenerateUnitTest(context) {
    let disposableNexiusAIAssistantGenerateUnitTest = vscode.commands.registerCommand('extension.nexiusaiassistantGenerateUnitTest', async function () {
        try {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor found. Please open a file to send its content.');
                return;
            }
            const openAiApiKey = await getConfig('No OpenAI API key found. Please set your OpenAI API key in the settings.', 'openaiapiKey');
            const unitTestPrompt = await getConfig('No unit test prompt found. Please set the unit test prompt in the settings.', 'unitTestPrompt');
            if (openAiApiKey === '' || unitTestPrompt === '') {
                return
            }
            const documentText = editor.document.getText();
            const userContent = unitTestPrompt.replace('{{code}}', documentText);
            const answer = await callOpenAiApi(userContent, openAiApiKey);
            const newDocument = await vscode.workspace.openTextDocument(
                {
                    content: answer,
                    language: 'typescript'
                }
            );
            await vscode.window.showTextDocument(newDocument);
        } catch (error) {
            const errorText = `Failed to query OpenAI API: ${error.message} , ${error.response.statusText}`;
            await showErrorModal(errorText);
            vscode.window.showErrorMessage(errorText);
        }
    });
    context.subscriptions.push(disposableNexiusAIAssistantGenerateUnitTest);
}

module.exports = registerDisposableNexiusAIAssistantGenerateUnitTest;