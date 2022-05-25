import * as vscode from 'vscode';

export class CodelensProvider implements vscode.CodeLensProvider {

    private codeLenses: vscode.CodeLens[] = [];

    public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
        this.codeLenses = [];
        
        this.codeLenses.push(new vscode.CodeLens(new vscode.Range(
            new vscode.Position(0, 1),
            new vscode.Position(0, 1)
        )));

        return this.codeLenses;
    }

    public resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken) {

        codeLens.command = {
            title: "▶️ Run Spec",
            command: "tspec-runner.runSpec",
        };

        return codeLens;
    }
    
}
