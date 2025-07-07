import { spawn } from "child_process";
import path from "path";
import os from "os";
function completion() {
	return `Completion: ${((tasks.length - runs.fail.length) / tasks.length) * 100}%`
}
const tasks = [
	"script.py",
	"pdf.js",
	"png.js",
	"README.py",
];
let runs = {
	success: [],
	fail: []
}
const linux = {
	"npx rimraf node_modules package-lock.json": "rm -rf node_modules package-lock.json"
}
function osCheck(command) {
	if (os.platform() === "linux") {
		return linux[command]
	} else if (os.platform() === "win32") {
		return command
	}
}
const preprocess = [
	"python -m pip install --upgrade pip",
	"pip install pipreqs",
	"python -m pipreqs.pipreqs --encoding utf-8 ./ --force",
	"pip install -r requirements.txt",
	"npx rimraf node_modules package-lock.json",
	"npm install",
	"npm update"
];
async function preRun(stdout = false, stderr = false, index = 0) {
	return new Promise((resolve) => {
		console.log(`${index} / ${preprocess.length}`);
		if (index >= preprocess.length) {
			return resolve();
		}
		const command = osCheck(preprocess[index]);
		console.log(command);
		const run = spawn(command, {
			shell: true
		});
		if (stdout) {
			run.stdout?.on('data', (data) => console.log(`OUT:\n${`${data}`.replace(/^/gm, "\t")}`))
		};
		if (stderr) {
			run.stderr?.on('data', (data) => console.warn(`ERR:\n${`${data}`.replace(/^/gm, "\t")}`))
		}
		run.on("exit", (code) => {
			if (code !== 0) console.error(`FAIL:\n${`${command} failed with code ${code}`.replace(/^/gm, "\t")}`)
			preRun(stdout, stderr, index + 1).then(resolve);
		});
	})
}
function getFileType(file) {
	const ext = path.extname(file);
	return (
		ext === '.py' ? 'python' :
			ext === '.js' ? 'node' :
				null
	);
};
async function runTask(index = 0) {
	return new Promise((resolve) => {
		if (index >= tasks.length) {
			if (runs.fail.length > 0) {
				console.warn(completion())
			} else console.log(completion())
			if (runs.success.length > 0) console.log("Success:\n\t" + runs.success.join("\n\t"))
			if (runs.fail.length > 0) console.warn("Fail:\n\t" + runs.fail.join("\n\t"))
			return resolve();
		};
		const arg = tasks[index];
		const cmd = getFileType(arg);
		const args = path.join("scripts", arg);
		const proc = spawn(cmd, [args], { stdio: "inherit" });
		console.log(`${[cmd, args].join(" ")} has started`)
		proc.on("exit", (code) => {
			console.log(`${[cmd, args].join(" ")} exited with code ${code}`);
			if (code === 0) {
				runs.success.push([cmd, args].join(" "))
			} else runs.fail.push([cmd, args].join(" "))
			runTask(index + 1);
		});
	})
}
async function postRun() {
	return new Promise((resolve) => {
		return resolve();
	})
}
async function main() {
	for (const f of [
		() => preRun(false, true),
		() => runTask(),
		() => postRun()
	]) {
		try {
			await f()
		} catch (err) {
			console.error(err)
		}
	}
};
main();