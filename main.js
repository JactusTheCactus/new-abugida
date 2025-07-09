import { spawn } from "child_process";
import path from "path";
import os from "os";
async function preRun({ stdout = false, stderr = false }, index = 0) {
	const vEnv = "ENV"
	const preprocess = [
		`python -m venv ${vEnv}`,
		`source ${vEnv}/bin/activate`,
		//"python -m pip install --upgrade pip",
		//"pip install pipreqs",
		//"python -m pipreqs.pipreqs --encoding utf-8 ./ --force",
		//"pip install -r requirements.txt",
		//"rm -rf node_modules package-lock.json",
		//"npm install",
		//"npm update"
	];
	return new Promise((resolve) => {
		console.log(`${index} / ${preprocess.length}`);
		if (index >= preprocess.length) {
			return resolve();
		}
		const command = preprocess[index]
		console.log(command);
		const run = spawn(command, {
			shell: true
		});
		if (stdout) {
			run.stdout?.on('data', (data) => {
				data = data = `${data}`;
				data = data
					.replace(/^[\s]+/gm, "")
					.replace(/\n+/g, "\n")
					.trim();
				if (data) {
					console.log(data)
				}
			})
		};
		if (stderr) {
			run.stderr?.on('data', (data) => {
				data = `${data}`
				data = data
					.replace(/^[\s]+/gm, "")
					.replace(/\n+/g, "\n")
					.trim();
				if (data) {
					console.warn(data)
				}
			})
		}
		run.on("exit", (code) => {
			if (code !== 0) console.error(`${command} failed with code ${code}`.replace(/^/gm, "FAIL:\t"))
			preRun({ stdout, stderr }, index + 1).then(resolve);
		});
	})
}
async function runTask({ stdout = false, stderr = false }, index = 0) {
	function getFileType(file) {
		const ext = path.extname(file);
		return (
			ext === '.py' ? 'python' :
				ext === '.js' ? 'node' :
					null
		);
	};
	function completion() {
		const count = tasks.length - runs.fail.length;
		const num = Math.round(((count) / tasks.length) * 100);
		return `Completion:\n\t${count} / ${tasks.length}\n\t${num}%`
	};
	const tasks = [
		//"script.py",
		/*==========*/
		//"pdf.js",
		"png.js",
		/*==========*/
		//"readme.py"
	];
	let runs = {
		success: [],
		fail: []
	}
	return new Promise((resolve) => {
		if (index >= tasks.length) {
			if (runs.fail.length > 0) {
				console.warn(completion())
			} else console.log(completion())
			if (runs.success.length > 0) console.log("Success:\n\t" + runs.success.join("\n\t"))
			if (runs.fail.length > 0) console.warn("Fail:\n" + runs.fail.join("\n"))
			return resolve();
		};
		const arg = tasks[index];
		const cmd = getFileType(arg);
		const args = path.join("scripts", arg);
		const proc = spawn(cmd, [args], { shell: false });
		if (stdout) {
			proc.stdout?.on('data', (data) => console.log(`${data}`.replace(/^/gm, "\nOUT:\t").replace(/\n+/g, "\n")))
		};
		if (stderr) {
			proc.stderr?.on('data', (data) => console.warn(`${data}`.replace(/^/gm, "\nERR:\t").replace(/\n+/g, "\n")))
		}
		console.log(`Run ${arg}`)
		proc.on("exit", (code) => {
			if (code === 0) {
				runs.success.push(arg)
			} else {
				console.warn(`${arg} failed with code ${code}`);
				runs.fail.push(arg)
			};
			runTask({ stdout, stderr }, index + 1);
		});
	})
}
async function postRun({ stdout = false, stderr = false }, index = 0) {
	return new Promise((resolve) => {
		if (1) {
			console.log("Complete!")
			return resolve();
		};
		const _ = spawn("deactivate", { shell: false });
		if (stdout) {
			_.stdout?.on('data', (data) => {
				console.log(`${data}`.replace(/^/gm, "\nOUT:\t").replace(/\n+/g, "\n"))
			})
		};
		if (stderr) {
			_.stderr?.on('data', (data) => {
				console.warn(`${data}`.replace(/^/gm, "\nERR:\t").replace(/\n+/g, "\n"))
			})
		}
		_.on("exit", (code) => {
			if (code !== 0) {
				console.warn(`${arg} failed with code ${code}`);
			};
			console.log(`Run #${index} Ended ${!code ? "Successfully" : ""}`)
			postRun({ stdout, stderr }, index + 1);
		});
	})
};
(async () => {
	for (const f of [
		() => preRun({
			stdout: true,
			stderr: true
		}),
		/*() => runTask({
			stdout: true,
			stderr: true
		}),*/
		() => postRun({
			stdout: true,
			stderr: true
		})
	]) {
		try {
			await f()
		}
		catch (err) {
			console.error(err)
		}
	}
})();