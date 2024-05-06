import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { files } from "@/server/db/schema";
import { randomBytes } from "crypto";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
     // Define as many FileRoutes as you like, each with a unique routeSlug
     chatArea: f(["image", "video", "audio", "pdf"])
          // Set permissions and file types for this FileRoute
          .middleware(async () => {
               // This code runs on your server before upload
               const session = await auth();
               if (!session) {
                    // If you throw, the user will not be able to upload
                    throw new UploadThingError("Unauthorized");
               }
               // Whatever is returned here is accessible in onUploadComplete as `metadata`
               return { userId: session.user.id };
          })
          .onUploadComplete(async ({ metadata, file }) => {
               // This code RUNS ON YOUR SERVER after upload
               console.log("Upload complete for userId:", metadata.userId);
               console.log("file url", file.url);
               const uploadedFile = await db.insert(files).values({
                    id: file.customId ?? randomBytes(16).toString("hex"),
                    url: file.url,
                    type: file.type,
                    name: file.name,
                    size: file.size,
                    key: file.key,
                    uploadedById: metadata.userId,
               }).returning({
                    id: files.id,
                    name: files.name,
                    size: files.size,
                    type: files.type,
                    url: files.url,
                    key: files.key,
                    uploadedById: files.uploadedById,
               }).then((d) => d[0]);
               // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
               return uploadedFile;
          }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
