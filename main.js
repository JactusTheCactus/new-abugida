import { spawn } from "child_process";
import path from "path";
const vEnv = "ENV";
function env(input) { return path.join(".", vEnv, "bin", input) }
const python = env("python");
const pip = env("pip");
async function preRun({ stdout = false, stderr = false }, index = 0) {
	const preprocess = [
		`python3 -m venv ${vEnv}`,
		`${pip} install requests`,
		`${python} -m pip install --upgrade pip`,
		`${pip} install pipreqs`,
		`${python} -m pipreqs.pipreqs --encoding utf-8 ./scripts --force`,
		`${pip} install -r ./scripts/requirements.txt`,
		`rm -rf node_modules package-lock.json`,
		`npm install`,
		`npm update`
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
				data = `${data}`;
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
		return {
			".py": python,
			".js": "node"
		}[ext] || null
	};
	const tasks = [
		"script.py",
		"pdf.js",
		"png.js",
		"readme.py"
	];
	return new Promise((resolve) => {
		console.log(`${index} / ${tasks.length}`)
		if (index >= tasks.length) {
			return resolve();
		};
		const arg = tasks[index];
		const cmd = getFileType(arg);
		const args = path.join("scripts", arg);
		const run = spawn(cmd, [args], { shell: false });
		if (stdout) {
			run.stdout?.on('data', (data) => {
				data = `${data}`;
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
		console.log(`${arg} started`)
		run.on("exit", (code) => {
			if (code === 0) {
				console.log(`${arg} completed`);
			} else {
				console.warn(`${arg} failed with code ${code}`);
			};
			runTask({ stdout, stderr }, index + 1).then(resolve);
		});
	})
}
async function postRun({ stdout = false, stderr = false }, index = 0) {
	const list = [
		`echo "Done!"`
	]
	return new Promise((resolve) => {
		if (index >= list.length) {
			console.log("Complete!")
			return resolve();
		};
		const arg = list[index];
		const run = spawn(arg, { shell: true });
		if (stdout) {
			run.stdout?.on('data', (data) => {
				data = `${data}`;
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
			if (code !== 0) {
				console.warn(`${arg} failed with code ${code}`);
			};
			postRun({ stdout, stderr }, index + 1).then(resolve);
		});
	})
};
(async () => {
	try {
		await preRun({
			stdout: false,
			stderr: false
		});
		await runTask({
			stdout: true,
			stderr: true
		});
		await postRun({
			stdout: false,
			stderr: false
		});
	}
	catch (err) {
		console.error(err)
	}
})();