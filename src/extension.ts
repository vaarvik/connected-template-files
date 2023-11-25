import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand(
        'connected-template-files.createComponent',
        async (uri) => {
            if (!uri) {
                vscode.window.showErrorMessage('No folder selected');
                return;
            }
            // Ask for the component name
            const componentName = await vscode.window.showInputBox({
                prompt: 'Enter Component Name',
            });

            if (!componentName) return; // exit if no name is provided

            const folderPath = uri.fsPath;

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
                    fs.mkdirSync(componentDir);
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
