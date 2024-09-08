import { ExtensionContext } from "vscode";
import { DerrisEditorProvider } from "./providers/EditorProvider";

export function activate(context: ExtensionContext) {
  const customJWTEditorProvider = new DerrisEditorProvider(context);
  customJWTEditorProvider.register();
}
