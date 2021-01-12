import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorldPanel';
import { SidebarProvider } from './SidebarProvider';


export function activate(context: vscode.ExtensionContext) {
	const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "todovs-sidebar",
      sidebarProvider
    )
  );

  const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
  item.text = "$(file-code) Add todo";
  item.command = 'todovs.addTodo';
  item.show();

	context.subscriptions.push(
		vscode.commands.registerCommand('todovs.helloWorld', () => {
			HelloWorldPanel.createOrShow(context.extensionUri);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('todovs.addTodo', () => {
			const {activeTextEditor} = vscode.window;

			if(!activeTextEditor){
				vscode.window.showInformationMessage("No active text editor");
				return;
			}

			const text = activeTextEditor.document.getText(activeTextEditor.selection);
			
			sidebarProvider._view?.webview.postMessage({
				type: "new-todo",
				value: text
			});
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('todovs.refresh', () => {
			HelloWorldPanel.kill();
			HelloWorldPanel.createOrShow(context.extensionUri);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("todovs.askQuestion", () => {
			vscode.window.showInformationMessage("how was your day?", "good", "bad");
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("todovs.caioQuestion", async () => {
			const answer = await vscode.window.showInformationMessage("Do you like bread?", "yes", "yes");
			
			if(answer === "sim" || answer === undefined){
				vscode.window.showInformationMessage("Indeed");
			} else {
				console.log(answer);
			}
		}),

	);

}


export function deactivate() { }
