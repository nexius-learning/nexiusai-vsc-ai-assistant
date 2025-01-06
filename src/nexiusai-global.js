const vscode = require('vscode');
const axios = require('axios');
const getConfig = async (errorText, configurationKey, l10nConfig) => {
    const configuration = vscode.workspace.getConfiguration('nexiusaiassistantSettings');
    const configKey = configuration.get(configurationKey, '');
    if (configKey === '') {
        await showErrorNoSetting(errorText, `nexiusaiassistantSettings.${configurationKey}`, l10nConfig);
    }
    return configKey;
}
const showErrorModal = async (message) => {
    await vscode.window.showInformationMessage(
        message,
        {modal: true}
    );
}

const showErrorNoSetting = async (message, settingKey, l10nConfig) => {
    const selection = await vscode.window.showInformationMessage(
        message,
        {modal: true},
        l10nConfig.t('buttonGotoSettings')
    );
    if (selection === l10nConfig.t('buttonGotoSettings')) {
        await vscode.commands.executeCommand('workbench.action.openSettings', settingKey);
    }
}
const callOpenAiApi = async (context, userContent, l10nConfig) => {
    const secretStorage = context.secrets;
    let storedOpenAIApiKey = await secretStorage.get('nexiusaiassistantSettings.openAIApiKey');
    if (!storedOpenAIApiKey) {
        vscode.window.showInformationMessage(l10nConfig.t('errorOpenAIKeyNotFound'));
        const storedOpenAIApiKey = await vscode.window.showInputBox({
            prompt: l10nConfig.t('errorPleaseProvideYourOpenAI'),
            password: true,
            ignoreFocusOut: true,
        });
        if (!storedOpenAIApiKey) {
            console.log('No OpenAI API key provided');
            return
        }
        await secretStorage.store('nexiusaiassistantSettings.openAIApiKey', storedOpenAIApiKey);
        return await callRemoteOpenAiApi(userContent, storedOpenAIApiKey, l10nConfig);
    } else {
        return await callRemoteOpenAiApi(userContent, storedOpenAIApiKey, l10nConfig);
    }

}
const callRemoteOpenAiApi = async (userContent, openAiApiKey, l10nConfig) => {
    vscode.window.showInformationMessage(l10nConfig.t('infoOpenAIInProgress'));
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
    vscode.window.showInformationMessage(l10nConfig.t('infoOpenAiAnswerReceived'));
    const answer = response.data.choices[0].message.content;
    return answer;
}
module.exports = {
    getConfig,
    callOpenAiApi,
    showErrorNoSetting,
    showErrorModal
};