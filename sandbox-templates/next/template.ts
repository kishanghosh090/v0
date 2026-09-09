import { Template } from "e2b";

export const template = Template()
  .fromImage("node:22-slim")

  .setUser("root")
  .setWorkdir("/")

  .runCmd(
    "apt-get update && " +
      "apt-get install -y curl sudo && " +
      "apt-get clean && " +
      "rm -rf /var/lib/apt/lists/*",
  )

  .copy("compile_page.sh", "/compile_page.sh")

  .runCmd("chmod +x /compile_page.sh")

  // Create the directory first
  .runCmd("mkdir -p /home/user/nextjs-app")

  .setWorkdir("/home/user/nextjs-app")

  // Create Next.js non-interactively
  .runCmd(
    "npx --yes create-next-app@16.3.4 . " +
      "--yes " +
      "--ts " +
      "--tailwind " +
      "--eslint " +
      "--app " +
      "--src-dir " +
      "--use-npm " +
      "--import-alias '@/*'",
  )

  // Initialize shadcn INSIDE the existing Next.js project
  .runCmd(
    "npx --yes shadcn@latest init " + "--preset nova " + "--yes " + "--force",
  )

  // Install components
  .runCmd("npx --yes shadcn@latest add --all --yes --overwrite")

  .setUser("user")

  .setStartCmd("sudo /compile_page.sh", "sleep 20");
