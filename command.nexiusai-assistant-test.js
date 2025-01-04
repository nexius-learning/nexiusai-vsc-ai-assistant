const vscode = require('vscode');
const {callOpenAiApi} = require('./nexiusai-global');

function registerDisposableNexiusAIAssistantTest(context) {
    let disposableNexiusAIAssistantTest = vscode.commands.registerCommand('extension.nexiusaiassistantTest', async function () {
        try {
            const secretStorage = context.secrets;
            const storedOpenAIApiKey = await secretStorage.get('my-api-key');
            if (!storedOpenAIApiKey) {
                vscode.window.showInformationMessage('Nincs elmentett API kulcs!');
                const apiKey = await vscode.window.showInputBox({
                    prompt: 'Add meg az API kulcsodat',
                    password: true, // Ez titkosítja a beírt karaktereket
                    ignoreFocusOut: true,
                });
                if (apiKey) {
                    // Kulcs mentése titkosított tárolóba
                    await secretStorage.store('my-api-key', apiKey);
                    vscode.window.showInformationMessage('API kulcs elmentve!');
                }
                return;
            }
            vscode.window.showInformationMessage(`response: ${storedOpenAIApiKey} `);
            /*
            const apiKey = await vscode.window.showInputBox({
                prompt: 'Add meg az API kulcsodat',
                password: true, // Ez titkosítja a beírt karaktereket
                ignoreFocusOut: true,
            });
            if (apiKey) {
                // Kulcs mentése titkosított tárolóba
                await secretStorage.store('my-api-key', apiKey);
                vscode.window.showInformationMessage('API kulcs elmentve!');
            }
            const response = await callOpenAiApi("Hello", openAiApiKey);
            vscode.window.showInformationMessage(`response: ${response} `);
             */
        } catch (error) {
            console.log(error)
            vscode.window.showErrorMessage(`Failed to query OpenAI API: ${error.message}`);
        }
    });
    context.subscriptions.push(disposableNexiusAIAssistantTest);
}


module.exports = registerDisposableNexiusAIAssistantTest;