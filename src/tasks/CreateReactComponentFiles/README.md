# React Component Creator Setup

This README explains how to set up the React component creator script and templates in a Visual Studio Code project.

## Files

-   `createComponentFiles.js`: This Node.js script generates a new React component and an associated index file.
-   `componentTemplate.tsx`: Template file for the React component.
-   `indexTemplate.ts`: Template file for the index file.
-   `tasks.json`: VS Code tasks configuration for running the script.

## Setup Steps

1. **Copy Files**: Copy `createComponentFiles.js`, `componentTemplate.tsx`, and `indexTemplate.ts` into the `.vscode` directory of your new project.

2. **Configure Task**:

    - Copy the `tasks.json` file into the `.vscode` directory.
    - Ensure the paths in the `tasks.json` file match the location of your script and templates.

3. **Configure Shortcut** (Optional):

    - Copy the following setting info `./vscode/settings.json`:
      `"workspaceKeybindings.createReactComponentFiles.enabled": true`
    - Copy the following keybinding info global keybindings.json:

    ```
    {
        "key": "ctrl+alt+n",
        "command": "workbench.action.tasks.runTask",
        "args": "Create React Component",
        "when": "config.workspaceKeybindings.createReactComponentFiles.enabled" // Must be "config.{settingName}"
    }
    ```

4. **Usage**:
    - Use the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and select "Tasks: Run Task".
    - Choose "Create React Component".
    - Enter the name of the component when prompted.

## Important Notes

-   This setup is designed for ease of use in individual projects.
-   Remember to adjust paths in the script and task configuration if you change the structure of your project.
