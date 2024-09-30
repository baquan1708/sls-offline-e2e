/* eslint-disable */
const { spawn } = require("child_process");
const { readFileSync } = require("fs");
const path = require("path");

const cwd = path.resolve(__dirname, ".");

const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

const retry = async function (fn, options) {
  const { retries, retryIntervalMs } = options;
  try {
    await sleep(retryIntervalMs);
    return await fn();
  } catch (error) {
    console.log(`Retry: ${retries}::: ${error}`);
    if (retries <= 0) {
      throw error;
    }
    await sleep(retryIntervalMs);
    return retry(fn, { retries: retries - 1, retryIntervalMs });
  }
};

const slsStable = async function () {
  await retry(
    async function () {
      const fileContent = readFileSync(
        path.join(__dirname, "sls_pid.out.txt"),
        "utf-8"
      );
      const result = fileContent.length > 0;
      console.log("slsStable", result);
      if (result) return;
      throw new Error("sls is not stable!");
    },
    { retries: 10, retryIntervalMs: 5 * 1000 }
  );
};

const runCommand = function (cmd, args) {
  console.log(`Running command: ${cmd} ${args.join(" ")}`);

  const process = spawn(cmd, args, {
    cwd,
    detached: true, // Allow the process to run independently
    stdio: "ignore", // Ignore stdio (no output to the console)
  });

  process.unref(); // Allow the parent process to exit independently

  console.log(`Started process with PID: ${process.pid}`);
};

module.exports = async function () {
  try {
    runCommand("bash", ["start.sh"]); // Adjust command and args if needed

    await slsStable();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
