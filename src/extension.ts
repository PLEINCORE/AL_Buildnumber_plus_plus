import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('abpp.IncreaseAndRun',async () => {
		const fs = require('fs');
		
		//find all app.json files in the workspace
		let appFiles = await vscode.workspace.findFiles('app.json');

		//foreach file parse the data and increment the version on the Build
		appFiles.forEach(file => {
			fs.readFile(file.fsPath, 'utf8', (err : any, data : any) => {
				if (err) {
					console.error(err);
					return;
				}
				
				const appJson = JSON.parse(data);
				const currentVersion = appJson.version;
				const newVersion = incrementVersion(currentVersion);
				
				appJson.version = newVersion;
				
				//write changed file!
				fs.writeFile(file.fsPath, JSON.stringify(appJson, null, 2), 'utf8', (err : any) => {
					if (err) {
					console.error(err);
					return;
					}
					console.log(`Version incremented to ${newVersion}`);
				});
			});
		});
		vscode.commands.executeCommand('al.package');
		vscode.commands.executeCommand('al.publish');
	});

	context.subscriptions.push(disposable);
	console.log('Morten hopes, it helps while developing! "al-buildnumber-plus-plus" is now active!');
}

function incrementVersion(version : any) {
	const versionParts = version.split('.');
	const lastPartIndex = versionParts.length - 1;
	versionParts[lastPartIndex] = Number(versionParts[lastPartIndex]) + 1;
	return versionParts.join('.');
  }

// This method is called when your extension is deactivated
export function deactivate() {}
