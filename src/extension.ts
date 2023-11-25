import * as vscode from 'vscode';
import { createComponentCommand } from './commands/createComponentCommand';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        'connected-template-files.createComponent',
        createComponentCommand
    );
    context.subscriptions.push(disposable);
}

export function deactivate() {}
