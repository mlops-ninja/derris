import * as vscode from 'vscode';
import { Uri } from 'vscode';
import { getUri } from '../utilities/getUri';
import { getNonce } from '../utilities/getNonce';

export class JWTEditorProvider implements vscode.CustomTextEditorProvider {
    private static readonly viewType = 'derris.jwtEditor';
    private registration: vscode.Disposable | undefined

    constructor(
        private readonly context: vscode.ExtensionContext
    ) { }

    public register() {
        const registration = vscode.window.registerCustomEditorProvider(JWTEditorProvider.viewType, this);
        this.context.subscriptions.push(registration);
        this.registration = registration;
    }

    public async resolveCustomTextEditor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        token: vscode.CancellationToken
    ): Promise<void> {
        webviewPanel.webview.options = {
            enableScripts: true,
            localResourceRoots: [Uri.joinPath(this.context.extensionUri, "out"), Uri.joinPath(this.context.extensionUri, "webview-ui/dist")],
        };

        let extension = document.uri.path.split('.').pop();


        // Here we are checking the file extension to determine file type.
        // Accorfing to it we are taking descision: if to open the file in default editor or in custom editor.
        switch (extension) {
            case 'jwt':
                webviewPanel.webview.html = this._getHtmlForWebview(webviewPanel.webview);
                webviewPanel.title = 'JWT Editor';
                break;
            default:
                vscode.window.showErrorMessage('This file is not a JWT file.');
        }

        function updateWebview() {
            webviewPanel.webview.postMessage({
                type: 'update',
                text: document.getText(),
            });
        }

        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(event => {
            if (event.document.uri.toString() === document.uri.toString()) {
                updateWebview();
            }
        });

        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        });

        webviewPanel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'init-view':
                    vscode.window.showInformationMessage('Webview Loaded');
                    webviewPanel.webview.postMessage({
                        type: 'init',
                        text: document.getText(),
                    })
                case 'update':
                    return;
            }
        });


        updateWebview();
    }


    private _getHtmlForWebview(webview: vscode.Webview): string {
        // The CSS file from the Svelte build output
        const stylesUri = getUri(webview, this.context.extensionUri, ["webview-ui", "dist", "assets", "index.css"]);
        // The JS file from the Svelte build output
        const scriptUri = getUri(webview, this.context.extensionUri, ["webview-ui", "dist", "build", "index.js"]);

        const nonce = getNonce();

        // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
        return /*html*/ `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <title>Editor</title>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
                <link rel="stylesheet" type="text/css" href="${stylesUri}">
                <script type="module" defer nonce="${nonce}" src="${scriptUri}"></script>
            </head>
            <body>
            </body>
            </html>
        `;
    }
}
