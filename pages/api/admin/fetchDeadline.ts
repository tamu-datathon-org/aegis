import { authenticatedRoute } from "../../../libs/middleware";
import clientPromise from "../../../utils/db";
import { VercelRequest, VercelResponse } from "@vercel/node";
import nextConnect from "next-connect";

const handler = nextConnect();
handler.get(
  authenticatedRoute(
    async (req: VercelRequest, res: VercelResponse, tdUser) => {
      if (tdUser?.isAdmin) {
        let client;
        try {
          client = await clientPromise;
          const db = client.db();
          const result = await db.collection("settings").distinct("deadline");
          if (result != null) res.status(200).json(result);
          else {
            res.status(404).json({ message: "Unable to retrieve the date." });
          }
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Error fetching date", error });
        } finally {
        }
      } else {
        res
          .status(401)
          .json({ message: "Unauthorized access: You are not an admin." });
      }
    }
  )
);

export default handler;
