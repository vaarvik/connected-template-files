import * as vscode from 'vscode';
import { createComponentFiles } from '../utils/componentCreator';
import { resolveFolderPath } from '../utils/pathResolver';

export async function createComponentCommand(uri: vscode.Uri) {
    const folderPath = await resolveFolderPath(uri);

    if (!folderPath) return; // exit if no folder path resolved

    const componentName = await vscode.window.showInputBox({
        prompt: 'Enter Component Name',
    });

    if (!componentName) return; // exit if no name is provided

    try {
        await createComponentFiles(folderPath, componentName);
        vscode.window.showInformationMessage(
            `Component files created for: ${componentName}`
        );
    } catch (error) {
        if (error instanceof Error) {
            vscode.window.showErrorMessage(
                `Error creating component files: ${error.message}`
            );
        } else {
            vscode.window.showErrorMessage(`An unknown error occurred.`);
        }
    }
}
