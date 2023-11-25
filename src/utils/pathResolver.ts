import * as path from 'path';
import * as vscode from 'vscode';

export async function resolveFolderPath(
    uri: vscode.Uri
): Promise<string | undefined> {
    if (uri && uri.fsPath) {
        // Action triggered by right-clicking on a folder
        return uri.fsPath;
    }

    // Prompt user for path resolution method
    const userChoice = await promptForPathResolutionMethod();
    if (!userChoice) return;

    return userChoice === 'CURRENT_DIRECTORY'
        ? getCurrentDirectoryPath()
        : await getCustomFolderPath();
}

async function promptForPathResolutionMethod(): Promise<string | undefined> {
    const response = await vscode.window.showQuickPick(
        [
            { label: 'Use Current Directory', value: 'CURRENT_DIRECTORY' },
            {
                label: 'Specify Different Directory',
                value: 'SPECIFY_DIRECTORY',
            },
        ],
        { placeHolder: 'Choose directory for the component' }
    );
    return response?.value;
}

function getCurrentDirectoryPath(): string | undefined {
    const activeEditor = vscode.window.activeTextEditor;
    return activeEditor
        ? path.dirname(activeEditor.document.uri.fsPath)
        : undefined;
}

async function getCustomFolderPath(): Promise<string | undefined> {
    const input = await vscode.window.showInputBox({
        prompt: 'Enter the path for the new component (relative or absolute)',
    });
    if (!input) return;

    const workspaceRoot = vscode.workspace.rootPath || '';
    const basePath = getCurrentDirectoryPath() || workspaceRoot;
    const resolvedPath = input.startsWith('/')
        ? path.join(workspaceRoot, input)
        : path.resolve(basePath, input);

    return resolvedPath;
}
