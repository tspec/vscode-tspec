import * as vscode from 'vscode';

export class CodelensRunSpecProvider implements vscode.CodeLensProvider {

    private codeLenses: vscode.CodeLens[] = [];
    private titles: RegExp = /^\s*##.+/;

    public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
        this.codeLenses = [];
        
        const top = new vscode.CodeLens(new vscode.Range(
            new vscode.Position(0, 1),
            new vscode.Position(0, 1)
        ));

        this.codeLenses.push(top);

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const isTitle = this.titles.test(line.text);

            if (isTitle) {
                this.codeLenses.push(new vscode.CodeLens(line.range));
            }
        }

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

export class CodelensFormatProvider implements vscode.CodeLensProvider {

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