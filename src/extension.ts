import { ExtensionContext } from "vscode";
import { JWTEditorProvider } from "./providers/JwtEditorProvider";

export function activate(context: ExtensionContext) {
  const customJWTEditorProvider = new JWTEditorProvider(context);
  customJWTEditorProvider.register();
}
