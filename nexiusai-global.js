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
/*
const startLangSmith = async (userContent) => {
    const response = await axios.post('https://api.smith.langchain.com/runs', 
        {
            "id": "123e4567-e89b-12d3-a456-426614174001",
            "name": "Visual Studio Code Extension",
            "run_type": "llm",
            "start_time": "2025-01-02T15:30:45.678901",
            "inputs": {"text": userContent}
        },  
        {
            headers: {
                'x-api-key': `Bearer ${openAiApiKey}`
            }
        }
    );
    const answer = response.data.choices[0].message.content;
    return answer;
}
*/
const callOpenAiApi = async (userContent, openAiApiKey) => {
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
    const answer = response.data.choices[0].message.content;
    return answer;
}
const uuidv4 = () => {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}
module.exports = {
    getConfig,
    callOpenAiApi,
    showErrorNoSetting,
    showErrorModal
};