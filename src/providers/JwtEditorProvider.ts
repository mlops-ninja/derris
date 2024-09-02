import * as vscode from 'vscode';
import { Uri } from 'vscode';
import { getUri } from '../utilities/getUri';
import { getNonce } from '../utilities/getNonce';

export class JWTEditorProvider implements vscode.CustomTextEditorProvider {
    private static readonly viewType = 'derris.jwtEditor';

    constructor(
        private readonly context: vscode.ExtensionContext
    ) { }

    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        const provider = new JWTEditorProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(JWTEditorProvider.viewType, provider);
        return providerRegistration;
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


        // This code is used to check if the user has enabled the JWT Editor in their settings.
        const useJWTEditor = vscode.workspace.getConfiguration('derris').get('useJWTCustomEditor');

        if (!useJWTEditor) {
            vscode.commands.executeCommand('vscode.openWith', document.uri, 'vscode.default');
            webviewPanel.dispose();
            return;
        } else {
            webviewPanel.webview.html = this._getHtmlForWebview(webviewPanel.webview);
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
