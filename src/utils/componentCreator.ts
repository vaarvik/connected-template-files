import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export async function createComponentFiles(
    folderPath: string,
    componentName: string
): Promise<void> {
    const componentDir = path.join(folderPath, componentName);
    createDirectoryIfNeeded(componentDir);

    const componentContent = getComponentTemplate(componentName);
    const indexPath = getIndexTemplate(componentName);

    fs.writeFileSync(
        path.join(componentDir, `${componentName}.tsx`),
        componentContent
    );
    fs.writeFileSync(path.join(componentDir, 'index.ts'), indexPath);

    await openComponentFileInEditor(
        path.join(componentDir, `${componentName}.tsx`)
    );
}

function createDirectoryIfNeeded(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function getComponentTemplate(componentName: string): string {
    return '';
}

function getIndexTemplate(componentName: string): string {
    return `export { default } from './__COMPONENT_NAME__';`;
}

async function openComponentFileInEditor(filePath: string): Promise<void> {
    const document = await vscode.workspace.openTextDocument(filePath);
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
}
