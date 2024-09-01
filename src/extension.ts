import { commands, ExtensionContext } from "vscode";
import * as vscode from "vscode";
import { HelloWorldPanel } from "./panels/HelloWorldPanel";
import { JWTEditorProvider } from "./providers/JwtEditorProvider";

export function activate(context: ExtensionContext) {
  // Register custom editor providers
  context.subscriptions.push(JWTEditorProvider.register(context));
}
