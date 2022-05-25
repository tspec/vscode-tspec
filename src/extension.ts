import * as vscode from 'vscode';
import { CodelensProvider, CodelensProvider2 } from './codelens_provider';
import { outputLogger } from './output_logger';

const tablePipes = /^\s*\|(.*?)\|?\s*$/;

function isLine(text: string) : boolean {
	for (const c of text) {
		if (c !== '-') {
			return false;
		}		
	}
	return true;
}

function formatTable(lines: vscode.TextLine[], edits: vscode.TextEdit[]) {
	let table: string[][] = [];
	let lens: number[] = [];
	// for (let i = 0; i < lines.length; i++) {
	// 	const line = lines[i];		
	// }
	// lines.forEach(tl => {
	// 	let text = tl.text.trim();
	// 	edits.push(vscode.TextEdit.replace(tl.range, `  ${text}`));
	// });
	lines.forEach((tl, j) => {
		let col: string[] = []
		table.push(col);
		if (j === 1) return;
		const m = tablePipes.exec(tl.text); // remove first and last pipe
		if (m) {
			let cols = m[1].split("|");
			cols.forEach((c, i) => {
				const colText = c.trim();
				col.push(colText);
				if (lens.length <= i) {
					lens.push(0);
				}
				if (lens[i] < colText.length) {
					lens[i] = colText.length;
				}
			});
		}
	});

	lines.forEach((tl, i) => {
		let text = "  |";
		let cols = table[i];
		lens.forEach((len, j) => {
			let col = ""
			if (cols.length > j) {
				col = cols[j];
			}
			if (i === 1) { // header line
				text += "-" + "".padEnd(len, "-") + "-|";
			}
			else {
				text += " " + col.padEnd(len, " ") + " |";
			}
		});
		edits.push(vscode.TextEdit.replace(tl.range, text));
	});
}

export function activate(context: vscode.ExtensionContext) {

	outputLogger.setLogger(vscode.window.createOutputChannel("Tspec"));

	outputLogger.log("Activating Tspec Runner...");

	outputLogger.log("Registering codelens provider.");

	const clp = new CodelensProvider();
	const clp2 = new CodelensProvider2();
	vscode.languages.registerCodeLensProvider('tspec', clp2);
	vscode.languages.registerCodeLensProvider('tspec', clp);

	outputLogger.log("Registering commands.");

	context.subscriptions.push(vscode.commands.registerCommand('tspec-runner.runSpec', async () => {

		const runSpec = (await vscode.tasks.fetchTasks()).find(t => t.name === 'run-tspec');

		if (runSpec) {
			vscode.tasks.executeTask(runSpec);
		}
		else {
			vscode.window.showErrorMessage("Task 'run-tspec' not found.");
		}

	}));

	vscode.languages.registerDocumentFormattingEditProvider('tspec', {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {

			const edits: vscode.TextEdit[] = [];

			const detect = /^\s*\|/;

			let table: vscode.TextLine[] = [];
			let seen = false;

			for (let i = 0; i < document.lineCount; i++) {

				const line = document.lineAt(i);

				const isTableLine = detect.test(line.text);

				if (isTableLine) {
					if (!seen) {
						seen = true;
						table = [];
					}
					table.push(line);
				}
				else {
					if (seen) {
						seen = false;
						formatTable(table, edits);
					}
				}
			}

			if (seen) {
				formatTable(table, edits);
			}

			return edits;
		}
	});

	outputLogger.log("Activation complete.");
}

export function deactivate() { }
