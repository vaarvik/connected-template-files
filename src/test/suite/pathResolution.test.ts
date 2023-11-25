import * as assert from 'assert';
import { afterEach } from 'mocha';
import path from 'path';
import sinon from 'sinon';
import * as vscode from 'vscode';
import { resolveFolderPath } from '../../utils/pathResolver'; // Adjust the import path as needed

suite('Path Resolution Tests', () => {
    // Create a mock QuickPickItem
    const mockQuickPickNoItem = {
        label: 'No, specify a different directory',
        value: 'SPECIFY_DIRECTORY',
    };
    const mockQuickPickYesItem = {
        label: 'Yes, use current directory',
        value: 'CURRENT_DIRECTORY',
    };

    // This will run after each test in this suite.
    afterEach(() => {
        sinon.restore(); // Restore all stubs
    });

    test('Resolve folder path from right-click', async () => {
        // Mock a Uri object to simulate right-click on a folder
        const mockUri = vscode.Uri.parse('file:///mock-folder-path');

        const resolvedPath = await resolveFolderPath(mockUri);
        const expectedPath = path.normalize('/mock-folder-path');
        assert.strictEqual(resolvedPath, expectedPath); // Adjust the expected path as needed
    });

    test('Use current directory for path resolution', async () => {
        const userPath = '/current-folder-path';
        // Mock the active text editor to simulate current directory
        const mockEditor = {
            document: {
                uri: vscode.Uri.parse(`file://${userPath}/file.txt`),
            },
        };
        sinon.stub(vscode.window, 'activeTextEditor').value(mockEditor);
        // Assume user selects 'Use Current Directory'
        sinon
            .stub(vscode.window, 'showQuickPick')
            .resolves(mockQuickPickYesItem);

        const resolvedPath = await resolveFolderPath(null); // Passing null to simulate non-right-click call
        const expectedPath = path.normalize(userPath);
        assert.strictEqual(resolvedPath, expectedPath);
    });

    test('Specify a different directory for path resolution', async () => {
        const userPath = '/specified-folder-path';
        // Mock user input for specifying a different directory
        sinon
            .stub(vscode.window, 'showQuickPick')
            .resolves(mockQuickPickNoItem);
        sinon.stub(vscode.window, 'showInputBox').resolves(userPath);

        const resolvedPath = await resolveFolderPath(null); // Passing null to simulate non-right-click call
        const expectedPath = path.normalize(userPath);
        assert.strictEqual(resolvedPath, expectedPath);
    });
});
