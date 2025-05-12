import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID } from "node-appwrite";

import { createWorkspaceSchema } from "../schema";
import { sessionMiddleware } from "@/lib/session-middleware";
import { WORKSPACES_ID, DATABASE_ID, IMAGES_BUCKET_ID } from "@/config";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const database = c.get("databases");

    const workspaces = await database.listDocuments(DATABASE_ID, WORKSPACES_ID);

    return c.json({
      data: workspaces,
    });
  })
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const database = c.get("databases");
      const user = c.get("user");
      const storage = c.get("storage");

      const { name, image } = c.req.valid("form");

      let uploadedImageUrl: string | undefined;

      if(image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );
        
        // const arrayBuffer = await storage.getFilePreview(
        //   IMAGES_BUCKET_ID,
        //   file.$id
        // );

        // const base64 = Buffer.from(arrayBuffer).toString('base64');
        // uploadedImageUrl = `data:image/png;base64,${base64}`;

        uploadedImageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${IMAGES_BUCKET_ID}/files/${file.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}&mode=admin`;
      }

      const workspace = await database.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          image: uploadedImageUrl,
        }
      );

      return c.json({
        data: workspace,
      });
    }
  );

export default app;