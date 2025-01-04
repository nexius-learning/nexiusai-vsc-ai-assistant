const vscode = require('vscode');
const axios = require('axios');
const getConfig = async (errorText, configurationKey) => {
    const configuration = vscode.workspace.getConfiguration('nexiusaiassistantSettings');
    const configKey = configuration.get(configurationKey, '');
    if (configKey === '') {
        await showErrorNoSetting(errorText, `nexiusaiassistantSettings.${configurationKey}`);
    }
    return configKey;
}
const showErrorModal = async (message) => {
    await vscode.window.showInformationMessage(
        message,
        {modal: true}
    );
}

const showErrorNoSetting = async (message, settingKey) => {
    const selection = await vscode.window.showInformationMessage(
        message,
        {modal: true},
        'Goto Settings'
    );
    if (selection === 'Goto Settings') {
        await vscode.commands.executeCommand('workbench.action.openSettings', settingKey);
    }
}
const callOpenAiApi = async (context, userContent) => {
    const secretStorage = context.secrets;
    let storedOpenAIApiKey = await secretStorage.get('nexiusaiassistantSettings.openAIApiKey');
    if (!storedOpenAIApiKey) {
        vscode.window.showInformationMessage('OpenAI API key not found. Please provide your OpenAI API key.');
        const storedOpenAIApiKey = await vscode.window.showInputBox({
            prompt: 'Please provide your OpenAI API key (the key will be stored securely)',
            password: true,
            ignoreFocusOut: true,
        });
        console.log(storedOpenAIApiKey);
        if (!storedOpenAIApiKey) {
            console.log('No OpenAI API key provided');
            return
        }
        await secretStorage.store('nexiusaiassistantSettings.openAIApiKey', storedOpenAIApiKey);
        return await callRemoteOpenAiApi(userContent, storedOpenAIApiKey);
    } else {
        return await callRemoteOpenAiApi(userContent, storedOpenAIApiKey);
    }

}
const callRemoteOpenAiApi = async (userContent, openAiApiKey) => {
    vscode.window.showInformationMessage('OpenAI in progress...');
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
    vscode.window.showInformationMessage('OpenAI anwser received.');
    const answer = response.data.choices[0].message.content;
    return answer;
}
module.exports = {
    getConfig,
    callOpenAiApi,
    showErrorNoSetting,
    showErrorModal
};