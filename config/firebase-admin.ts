import admin from 'firebase-admin';
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.resolve(__dirname, "anilathomes-hostelhub-firebase-adminsdk.json");
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));

if(!admin.apps || admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: "https://anilathomes-hostelhub.firebaseio.com",
    storageBucket: "anilathomes-hostelhub.appspot.com"
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();