import { spawn } from "child_process";
import path from "path";
const tasks = [
	//["python", ["script.py"]],
	["node", ["pdf.js"]],
	//["node", ["png.js"]],
];
function runTask(index = 0) {
	if (index >= tasks.length) return;
	const [cmd, args] = tasks[index];
	args[0] = path.join("scripts",args[0]);
	const proc = spawn(cmd, args, { stdio: "inherit" });
	proc.on("exit", (code) => {
		console.log(`${[cmd, args].join(" ")} exited with code ${code}`);
		runTask(index + 1);
	});
}
runTask();
