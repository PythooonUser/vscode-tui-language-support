import { ExtensionContext } from "vscode";
import { LanguageClient } from "vscode-languageclient/node";

let client: LanguageClient;

export function activate(context: ExtensionContext) {}

export function deactivate() {
  return client?.stop() ?? undefined;
}
