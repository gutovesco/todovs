import { Request } from 'polka';
import * as vscode from 'vscode';
import { apiBaseUrl } from './constants';
import { TokenManager } from './TokenManager';
const polka = require('polka');

export const authenticate = () => {
    const app = polka();

    app.get(`/auth/:token`, async (req: Request, res: any) => {
        const { token } = req.params;
        if (!token) {
            res.end(`<h1>Something went wrong!</h1>`);
            return;
        }
        
        await TokenManager.setToken(token);

        res.end(`<p>Auth was succesfull. You can close this now</p>`);

        (app as any).server.close();
    });

    app.listen(54321, (err: Error) => {
        if (err) {
            vscode.window.showErrorMessage(err.message);
        } else {
            vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`${apiBaseUrl}/auth/github`));
        }
    });
};