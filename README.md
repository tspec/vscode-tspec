# Tspec Runner (Preview)

Tspec Structured Plain Embedded Commands is a simple specification for writing text documents where some of the lines can be interpreted and executed by a program.

## Features

* Runs your custom task on a 'tspec' file.
* 'Run Spec' Codelens action on top of the file.

## Requirements

You need a task setup to support the run command. Task name must be `run-tspec`.

Example `tasks.json` for dotnet implementation of tspec:

```json
{
	"version": "2.0.0",
	"tasks": [
		{
			"label": "run-tspec",
			"type": "shell",
			"command": "dotnet",
			"args": ["run", "--", "${file}"],
			"options": {
				"cwd": "${fileWorkspaceFolder}"
			},
			"presentation": {
				"echo": true,
				"reveal": "always",
				"focus": false,
				"panel": "shared",
				"showReuseMessage": false,
				"clear": true
			},
			"problemMatcher": []
		}
	]
}
```

## Release Notes

This is a preview release with limited functionality.

### 0.0.1

Initial release.

**Enjoy!**
