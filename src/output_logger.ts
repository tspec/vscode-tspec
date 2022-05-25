import * as vscode from 'vscode';

class OutputLogger {

    private logger : vscode.OutputChannel | undefined = undefined;

    setLogger(outputLogger : vscode.OutputChannel) {
        this.logger = outputLogger;
    }

    log(message : string) {
        this.logger?.appendLine(message);
    }
}

export const outputLogger = new OutputLogger();
