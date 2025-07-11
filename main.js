import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from "path";
import fs from "fs"
const fonts = process.argv.slice(2);
async function main(font) {
	const vEnv = path.resolve(font !== "ENV" ? path.resolve("fonts", font) : "", "ENV");
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);
	function env(input) {
		return path.resolve(".", vEnv, "bin", input)
	}
	const python = env("python");
	const pip = env("pip");
	async function preRun(
		{
			stdout = false,
			stderr = false
		},
		index = 0
	) {
		const preprocess = `
python -m venv ${vEnv}
${python} -m ensurepip
${python} -m pip install --upgrade pip
${pip} install requests
${pip} install pipreqs
${python} -m pipreqs.pipreqs --encoding utf-8 ./scripts --force
${pip} install -r ./scripts/requirements.txt
rm -rf node_modules package-lock.json
npm install
npm update
npm install pdf-poppler
`
			.trim()
			.split("\n");
		return new Promise((resolve) => {
			console.log(`${index} / ${preprocess.length}`);
			if (index >= preprocess.length) {
				return resolve();
			}
			const command = preprocess[index]
			console.log(command);
			const run = spawn(
				command, {
				shell: true
			}
			);
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
					console.error(
						`${command} failed with code ${code}`
							.replace(/^/gm, "FAIL:\t")
					)
				}
				preRun(
					{
						stdout,
						stderr
					},
					index + 1
				)
					.then(resolve);
			});
		})
	}
	async function runTask(
		{
			stdout = false,
			stderr = false
		},
		index = 0
	) {
		function getFileType(file) {
			const ext = path.extname(file);
			return {
				".py": python,
				".js": "node"
			}[ext] || null
		};
		let tasks = [
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
			let newDir = path.join("fonts", font)
			if (!fs.existsSync(newDir)) fs.mkdirSync(newDir, { recursive: true });
			newDir = path.resolve(newDir)
			const arg = tasks[index];
			const file = arg.split(" ")[0]
			const cmd = getFileType(file);
			const args = path.resolve("scripts", file);
			const run = spawn(cmd, [args, ...arg.split(" ").splice(1)], {
				shell: false,
				cwd:
					font !== "ENV" ?
						newDir :
						undefined
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
			console.log(`${arg} started`)
			run.on("exit", (code) => {
				if (code === 0) {
					console.log(`${arg} completed`);
				} else {
					console.warn(`${arg} failed with code ${code}`);
				};
				runTask(
					{
						stdout,
						stderr
					},
					index + 1
				)
					.then(resolve);
			});
		})
	}
	async function postRun(
		{
			stdout = false,
			stderr = false
		},
		index = 0
	) {
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
				postRun(
					{
						stdout,
						stderr
					},
					index + 1
				)
					.then(resolve);
			});
		})
	};
<<<<<<< HEAD
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
			runTask(
				{
					stdout,
					stderr
				},
				index + 1
			)
				.then(resolve);
		});
	})
}
async function postRun(
	{
		stdout = false,
		stderr = false
	},
	index = 0
) {
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
			postRun(
				{
					stdout,
					stderr
				},
				index + 1
			)
				.then(resolve);
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
=======
	try {
		const run = [
			[true, false, false],
			[true, true, true],
			[true, false, false]
		];
		if (run[0][0]) await preRun({ stdout: run[0][1], stderr: run[0][2] });
		if (run[1][0]) await runTask({ stdout: run[1][1], stderr: run[1][2] });
		if (run[2][0]) await postRun({ stdout: run[2][1], stderr: run[2][2] });
>>>>>>> 225b6079 (-)
	}
	catch (err) {
		console.error(err)
	}
};
for (let i in fonts) {
	await main(path.join(fonts[i]));
}