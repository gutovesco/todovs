import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorldPanel';
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "todovs" is now active!');

	context.subscriptions.push(
		vscode.commands.registerCommand('todovs.helloWorld', () => {
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
