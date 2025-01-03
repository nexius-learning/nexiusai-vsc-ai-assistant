const assert = require('assert');
const vscode = require('vscode');
const sinon = require('sinon');
const axios = require('axios');
const registerDisposableNexiusAIAssistantGenerateUnitTest = require('../command.nexiusai-assistant-generate-unit-test');

describe('NexiusAI Assistant Extension', function () {
    let context;
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        context = { subscriptions: [] };

        // Mock VS Code functions
        sandbox.stub(vscode.window, 'activeTextEditor').value({
            document: {
                getText: () => 'sample code',
            },
        });

        sandbox.stub(vscode.window, 'showErrorMessage');
        sandbox.stub(vscode.window, 'showInformationMessage');
        sandbox.stub(vscode.workspace, 'getConfiguration').returns({
            get: (key) => {
                if (key === 'openaiapiKey') return 'test-api-key';
                if (key === 'unitTestPrompt') return 'Write a unit test for the following code: {{code}}';
            },
        });

        sandbox.stub(vscode.workspace, 'openTextDocument').resolves({});
        sandbox.stub(vscode.window, 'showTextDocument').resolves();

        // Mock axios
        sandbox.stub(axios, 'post').resolves({
            data: {
                choices: [
                    {
                        message: {
                            content: 'Generated unit test code',
                        },
                    },
                ],
            },
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should register the command successfully', () => {
        registerDisposableNexiusAIAssistantGenerateUnitTest(context);
        assert.strictEqual(context.subscriptions.length, 1);
    });

    it('should show an error if no active editor is found', async () => {
        vscode.window.activeTextEditor = null;

        const command = context.subscriptions[0];
        await command._callback();

        assert(vscode.window.showErrorMessage.calledWith('No active editor found. Please open a file to send its content.'));
    });

    it('should show an error if OpenAI API key is missing', async () => {
        vscode.workspace.getConfiguration().get = (key) => {
            if (key === 'openaiapiKey') return '';
            if (key === 'unitTestPrompt') return 'Write a unit test for the following code: {{code}}';
        };

        const command = context.subscriptions[0];
        await command._callback();

        assert(vscode.window.showErrorMessage.calledWith('No OpenAI API key found. Please set your OpenAI API key in the settings.'));
    });

    it('should call OpenAI API and open a new document with the response', async () => {
        const command = context.subscriptions[0];
        await command._callback();

        assert(vscode.window.showInformationMessage.calledWith("OpenAI's starting..."));
        assert(vscode.window.showInformationMessage.calledWith("OpenAI's response received..."));
        assert(axios.post.calledOnce);
        assert(vscode.workspace.openTextDocument.calledWith({
            content: 'Generated unit test code',
            language: 'typescript',
        }));
        assert(vscode.window.showTextDocument.calledOnce);
    });
});
