import DescopeClient from "@descope/node-sdk";

const projectId = process.env.DESCOPE_PROJECT_ID;
const managementKey = process.env.DESCOPE_MANAGEMENT_KEY;

if (!projectId) {
  console.warn("DESCOPE_PROJECT_ID is not set");
}

export const descopeClient = DescopeClient({
  projectId: projectId ?? "",
  managementKey: managementKey ?? "",
});

