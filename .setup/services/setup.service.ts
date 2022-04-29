import api from "./api.service";
import aw from "./aw.service";
import collections from "../data/collections";
import functions from "../data/functions";
import zipDirectory from "../utils/compress.util";
import fs from "fs";

const createProject = async () => {
  const teamId = (
    await api().post("/teams", {
      teamId: "unique()",
      name: "Pingvin Share",
    })
  ).data.$id;
  return await api().post("/projects", {
    projectId: "pingvin-share",
    name: "Pingvin Share",
    teamId,
  });
};

const addPlatform = async (hostname: string) => {
  await api().post("/projects/pingvin-share/platforms", {
    type: "web",
    name: "Pingvin Share Web Frontend",
    hostname: hostname,
  });
};

const createCollections = async () => {
  for (const collection of collections) {
    const { attributes } = collection;
    const { indexes } = collection;

    await aw().database.createCollection(
      collection.$id,
      collection.name,
      collection.permission,
      collection.$read,
      collection.$write
    );
    for (const attribute of attributes) {
      if (attribute.type == "string") {
        await aw().database.createStringAttribute(
          collection.$id,
          attribute.key,
          attribute.size,
          attribute.required,
          attribute.default,
          attribute.array
        );
      } else if (attribute.type == "integer") {
        await aw().database.createIntegerAttribute(
          collection.$id,
          attribute.key,
          attribute.required,
          attribute.min,
          attribute.max,
          attribute.default,
          attribute.array
        );
      } else if (attribute.type == "boolean") {
        await aw().database.createBooleanAttribute(
          collection.$id,
          attribute.key,
          attribute.required,
          attribute.default,
          attribute.array
        );
      }
    }
    // Wait until the indexes are created
    for (const index of indexes) {
      const getStatus = async () =>
        (
          await aw().database.getAttribute(collection.$id, index.key)
        ).status.toString();

      while ((await getStatus()) == "processing") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      aw().database.createIndex(
        collection.$id,
        index.key,
        index.type,
        index.attributes
      );
    }
  }
};

const generateFunctionsApiKey = async () => {
  const res = await api().post("/projects/pingvin-share/keys", {
    name: "Functions API Key",
    scopes: [
      "documents.read",
      "documents.write",
      "buckets.read",
      "buckets.write",
      "files.read",
    ],
  });
  return res.data.secret;
};

const createFunctions = async () => {
  for (const fcn of functions()) {
    await aw().functions.create(
      fcn.$id,
      fcn.name,
      fcn.execute,
      fcn.runtime,
      fcn.vars,
      fcn.events,
      fcn.schedule,
      fcn.timeout
    );
  }
};

const createFunctionDeployments = async () => {
  let path: string;
  for (const fcn of functions()) {
    (path = (await zipDirectory(fcn.$id)) as string),
      await aw().functions.createDeployment(
        fcn.$id,
        "src/index.js",
        path,
        true
      );
  }
  // Delete zip
  fs.unlinkSync(path);
};

export default {
  createProject,
  createCollections,
  createFunctions,
  createFunctionDeployments,
  generateFunctionsApiKey,
  addPlatform,
};
function token(token: any) {
  throw new Error("Function not implemented.");
}
