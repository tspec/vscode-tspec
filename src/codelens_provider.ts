import * as vscode from 'vscode';

export class CodelensProvider implements vscode.CodeLensProvider {

    private codeLenses: vscode.CodeLens[] = [];

    public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
        this.codeLenses = [];
        
        const cl = new vscode.CodeLens(new vscode.Range(
            new vscode.Position(0, 1),
            new vscode.Position(0, 1)
        ));

        this.codeLenses.push(cl);

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

export class CodelensProvider2 implements vscode.CodeLensProvider {

    private codeLenses: vscode.CodeLens[] = [];

    public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
        this.codeLenses = [];

        let seen = false;
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const isPipe = line.text.trim().startsWith("|");
            if (isPipe) {
                if (!seen) {
                    seen = true;
                    this.codeLenses.push(new vscode.CodeLens(line.range));
                }
            }
            else {
                if (seen) {
                    seen = false;
                }
            }
        }

        return this.codeLenses;
    }

    public resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken) {

        codeLens.command = {
            title: "☰ Format",
            command: "editor.action.formatDocument",
        };

        return codeLens;
    }
    
}