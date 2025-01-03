const vscode = require('vscode');
const { callOpenAiApi } = require('./nexiusai-global');
function registerDisposableNexiusAIAssistantTest(context) {
let disposableNexiusAIAssistantTest = vscode.commands.registerCommand('extension.nexiusaiassistantTest', async function () {
    try {
       const configuration = vscode.workspace.getConfiguration('nexiusaiassistantSettings');
      const openAiApiKey = configuration.get('openaiapiKey', '');
const response= await callOpenAiApi("Hello",openAiApiKey);



        vscode.window.showInformationMessage(`response: ${response} `);
        } catch (error) {
            console.log(error)
            vscode.window.showErrorMessage(`Failed to query OpenAI API: ${error.message}`);
        }
    });
    context.subscriptions.push(disposableNexiusAIAssistantTest);
}


module.exports = registerDisposableNexiusAIAssistantTest;