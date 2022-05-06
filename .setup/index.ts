import authService from "./services/auth.service";
import setupService from "./services/setup.service";
import rl from "readline-sync";

(async () => {
  console.info("\nWelcome to the Pingvin Share Appwrite setup 👋");
  console.info(
    "Please follow the questions and be sure that you ENTER THE CORRECT informations. Because the error handling isn't good.\n"
  );
  try {
    process.env["APPWRITE_HOST"] = rl.question(
      "Appwrite host (http://localhost/v1): ",
      {
        defaultInput: "http://localhost/v1",
      }
    );
    process.env["APPWRITE_HOST"] = process.env["APPWRITE_HOST"].replace(
      "localhost",
      "host.docker.internal"
    );

    console.info("Authenticate...");
    process.env["APPWRITE_USER_TOKEN"] = await authService.getToken();

    console.info("Creating project...");
    await setupService.createProject();

    console.info("Generating API key for setup...");
    process.env["APPWRITE_API_KEY"] = await authService.generateApiKey();

    console.info("Generating API key for functions...");
    process.env["APPWRITE_FUNCTION_API_KEY"] =
      await setupService.generateFunctionsApiKey();

    console.info("Creating collections...");
    await setupService.createCollections();

    console.info("Creating functions...");
    await setupService.createFunctions();

    console.info("Creating function deployments...");
    await setupService.createFunctionDeployments();

    console.info("Adding frontend host...");
    await setupService.addPlatform(
      rl.question("Frontend host of Pingvin Share (localhost): ", {
        defaultInput: "localhost",
      })
    );
  } catch (e) {
    console.error(e);
    console.error("\n\n ❌ Error: " + e.message);
    console.info(
      "\nSorry, an error occured while the setup. The full logs can be found above."
    );
    return;
  }
  console.info("\n✅ Done");
})();
export {};
