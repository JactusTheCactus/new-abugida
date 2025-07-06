const { spawn } = require("child_process");
const tasks = [
	["python", ["script.py"]],
	["node", ["pdf.js"]],
	["node", ["png.js"]],
];
function runTask(index = 0) {
	if (index >= tasks.length) return;
	const [cmd, args] = tasks[index];
	const proc = spawn(cmd, args, { stdio: "inherit" });
	proc.on("exit", (code) => {
		console.log(`${[cmd, args].join(" ")} exited with code ${code}`);
		runTask(index + 1);
	});
}
runTask();