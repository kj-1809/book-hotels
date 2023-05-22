/** server/uploadthing.ts */
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
const f = createUploadthing();
import { getServerAuthSession } from "./auth";

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f
    // Set permissions and file types for this FileRoute
    .fileTypes(["image"])
    .maxSize("8MB")
    .middleware(async (req, res) => {
      // This code runs on your server before upload
      const user = await getServerAuthSession({ req, res });
      // If you throw, the user will not be able to upload
      console.log("userr : ", user)
      if (!user) throw new Error("Unauthorized");

      if(user.user.role !== "ADMIN") throw new Error("Unauthorized")
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      // return { userId: user.user.id };
      return { userId: user.user.userId };
    })
    .onUploadComplete(async ({ metadata }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
