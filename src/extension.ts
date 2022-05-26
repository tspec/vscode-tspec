import * as vscode from 'vscode';
import { CodelensRunSpecProvider, CodelensFormatProvider } from './codelens_providers';
import { outputLogger } from './output_logger';

// remove first and last pipe and trim, also last pipe is optional
const tablePipes = /^\s*\|(.*?)\|?\s*$/;

const detectTableLine = /^\s*\|/;

function formatTable(lines: vscode.TextLine[], edits: vscode.TextEdit[]) {
	let table: string[][] = [];
	let lens: number[] = [];

	// First pass to find largest columns and populate table array
	lines.forEach((tl, i) => {
		let col: string[] = []
		table.push(col);

		if (i === 1) return; // header line

		const m = tablePipes.exec(tl.text);
		if (m) {
			let cols = m[1].split("|");
			cols.forEach((c, j) => {
				const colText = c.trim();
				col.push(colText);
				if (lens.length <= j) {
					lens.push(0);
				}
				if (lens[j] < colText.length) {
					lens[j] = colText.length;
				}
			});
		}
	});

	// Second pass to format
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

	outputLogger.log("Registering codelens providers.");

	vscode.languages.registerCodeLensProvider('tspec', new CodelensFormatProvider());
	vscode.languages.registerCodeLensProvider('tspec', new CodelensRunSpecProvider());

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

	outputLogger.log("Registering formatting provider.");

	context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('tspec', {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {

			const edits: vscode.TextEdit[] = [];

			let table: vscode.TextLine[] = [];
			let seen = false;

			for (let i = 0; i < document.lineCount; i++) {

				const line = document.lineAt(i);
				const isTableLine = detectTableLine.test(line.text);

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

			// Bottom of document, no more lines to unset 'seen'
			if (seen) {
				formatTable(table, edits);
			}

			return edits;
		}
	}));

	outputLogger.log("Activation complete.");
}

export function deactivate() { }
