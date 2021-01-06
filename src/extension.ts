import * as vscode from 'vscode';
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "todovs" is now active!');

	context.subscriptions.push(
		vscode.commands.registerCommand('todovs.helloWorld', () => {
			vscode.window.showInformationMessage('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb!');
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("todovs.askQuestion", () => {
			vscode.window.showInformationMessage("how was your day?", "good", "bad");
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("todovs.caioQuestion", async () => {
			const answer = await vscode.window.showInformationMessage("O caio é um otaro?", "sim", "sim");
			
			if(answer === "sim" || answer === undefined){
				vscode.window.showInformationMessage("Indeed");
			} else {
				console.log(answer);
			}
		}),

	);

}


export function deactivate() { }
