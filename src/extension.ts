import * as vscode from 'vscode';
import { CodelensProvider } from './codelens_provider';
import { outputLogger } from './output_logger';

export function activate(context: vscode.ExtensionContext) {
	
	outputLogger.setLogger(vscode.window.createOutputChannel("Tspec"));

	outputLogger.log("Activating Tspec Runner...");

	outputLogger.log("Registering codelens provider.");

	const clp = new CodelensProvider();
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

	outputLogger.log("Activation complete.");
}

export function deactivate() {}
