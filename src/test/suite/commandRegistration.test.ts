import * as assert from 'assert';
import sinon from 'sinon';
import * as vscode from 'vscode';

suite('Command Registration Tests', () => {
    test('Command is registered', async () => {
        // Ensure the extension is activated
        await vscode.extensions
            .getExtension('vaarvik.connected-template-files')
            ?.activate();

        const command = await vscode.commands.getCommands(true);
        assert.ok(command.includes('connected-template-files.createComponent'));
    });

    test('Command executes with mocked user input', async () => {
        // Create a mock QuickPickItem
        const mockQuickPickItem = { label: 'Yes, use current directory' };

        // Mock the showQuickPick function to return the mock QuickPickItem
        const quickPickStub = sinon
            .stub(vscode.window, 'showQuickPick')
            .resolves(mockQuickPickItem);

        // Execute the command
        try {
            await vscode.commands.executeCommand(
                'connected-template-files.createComponent'
            );
            assert.ok(true, 'Command executed successfully');
        } catch (error) {
            assert.fail('Command execution failed');
        } finally {
            // Restore the original function
            quickPickStub.restore();
        }
    });
});
