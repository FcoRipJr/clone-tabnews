const { spawn, spawnSync } = require("child_process");

function stopServices() {
  console.log("\n\n🔵 Stopping Docker...");
  spawnSync("npm run services:stop", { stdio: "inherit", shell: true });
}

try {
  let commands = [
    "npm run services:up",
    "npm run services:wait:database",
    "npm run migrations:up",
  ];

  for (const command of commands) {
    const result = spawnSync(command, {
      stdio: "inherit",
      shell: true,
    });

    if (result.status !== 0) {
      throw new Error(
        `Command "${command}" failed with exit code ${result.status}`,
      );
    }
  }

  const next = spawn("next", ["dev"], { stdio: "inherit", shell: true });

  process.on("SIGINT", () => {
    stopServices();
    process.exit(130);
  });

  process.on("SIGTERM", () => {
    stopServices();
    process.exit(143);
  });

  next.on("close", (code) => {
    stopServices();
    process.exit(code);
  });
} catch (error) {
  console.error("🔴 Initialization failed:", error.message);
  stopServices();
  process.exit(1);
}
