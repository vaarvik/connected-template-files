import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand(
        'connected-template-files.createComponent',
        async (uri) => {
            let folderPath;

            // Check if the action is triggered by right-clicking on a folder
            if (uri && uri.fsPath) {
                folderPath = uri.fsPath;
            } else {
                const yesString = 'Yes, use current directory';
                const noString = 'No, specify a different directory';

                // Prompt the user
                const useCurrentDirectoryResponse =
                    await vscode.window.showQuickPick([yesString, noString], {
                        placeHolder:
                            'Do you want to use the current directory?',
                    });

                if (useCurrentDirectoryResponse === yesString) {
                    // Use the current file's directory
                    const activeEditor = vscode.window.activeTextEditor;
                    if (activeEditor) {
                        folderPath = path.dirname(
                            activeEditor.document.uri.fsPath
                        );
                    } else {
                        vscode.window.showErrorMessage('No active file');
                        return;
                    }
                } else if (useCurrentDirectoryResponse === noString) {
                    // Allow the user to specify a directory
                    const inputFolderPath = await vscode.window.showInputBox({
                        prompt: 'Enter the path for the new component (relative or absolute)',
                    });
                    if (!inputFolderPath) return; // exit if no path is provided

                    // Determine the base path
                    const activeEditor = vscode.window.activeTextEditor;
                    const activeEditorPath = activeEditor
                        ? path.dirname(activeEditor.document.uri.fsPath)
                        : null;
                    const workspaceRoot = vscode.workspace.rootPath || '';
                    const basePath = activeEditorPath || workspaceRoot;

                    // Resolve the path
                    if (inputFolderPath.startsWith('/')) {
                        // Absolute path from the workspace root
                        folderPath = path.join(workspaceRoot, inputFolderPath);
                    } else if (inputFolderPath.startsWith('.')) {
                        // Relative path from the active file's directory or workspace root
                        folderPath = path.resolve(basePath, inputFolderPath);
                    } else {
                        folderPath = path.join(basePath);
                    }
                } else {
                    // User cancelled the selection
                    return;
                }
            }

            // Ask for the component name
            const componentName = await vscode.window.showInputBox({
                prompt: 'Enter Component Name',
            });

            if (!componentName) return; // exit if no name is provided

            // Template content as strings
            const componentTemplate = ``;

            const indexTemplate = `export * from './__COMPONENT_NAME__';`;

            // Replace the placeholder with the actual component name
            try {
                const componentContent = componentTemplate.replace(
                    /__COMPONENT_NAME__/g,
                    componentName
                );
                const indexContent = indexTemplate.replace(
                    /__COMPONENT_NAME__/g,
                    componentName
                );

                // Write the .tsx and index.ts files
                const componentDir = path.join(folderPath, componentName);
                if (!fs.existsSync(componentDir)) {
                    fs.mkdirSync(componentDir, { recursive: true });
                }

                fs.writeFileSync(
                    path.join(componentDir, `${componentName}.tsx`),
                    componentContent
                );

                fs.writeFileSync(
                    path.join(componentDir, 'index.ts'),
                    indexContent
                );

                vscode.window.showInformationMessage(
                    `Component files created for: ${componentName}`
                );

                // Path to the component template file
                const componentFilePath = path.join(
                    componentDir,
                    `${componentName}.tsx`
                );
                // Open the component template file
                const document = await vscode.workspace.openTextDocument(
                    componentFilePath
                );
                const editor = await vscode.window.showTextDocument(document);
                // Insert the new snippet
                const snippetString = new vscode.SnippetString(
                    'interface Props {\n' +
                        '    $1\n' +
                        '}\n\n' +
                        'const ${TM_FILENAME_BASE} = ({$2}: Props) => {\n' +
                        '    $3\n' +
                        '    return (\n' +
                        '        $0\n' +
                        '    );\n' +
                        '};\n\n' +
                        'export default ${TM_FILENAME_BASE};'
                );

                editor.insertSnippet(snippetString);
            } catch (error: any) {
                vscode.window.showErrorMessage(
                    `Error creating component files: ${error.message}`
                );
            }
        }
    );
    context.subscriptions.push(disposable);
}

export function deactivate() {}
