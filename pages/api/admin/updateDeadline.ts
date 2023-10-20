import { authenticatedRoute } from "../../../libs/middleware";
import clientPromise from "../../../utils/db";
import { VercelRequest, VercelResponse } from "@vercel/node";
import nextConnect from "next-connect";

const handler = nextConnect();
handler.post(
  authenticatedRoute(
    async (req: VercelRequest, res: VercelResponse, tdUser) => {
      if (tdUser?.isAdmin) {
        let client;
        try {
          client = await clientPromise;
          const db = client.db();
          const newDeadline = req.body.deadline; // Assuming the new deadline is passed in the request body

          // Update the deadline in the "settings" collection
          const result = await db.collection("settings").updateOne(
            {},
            {
              $set: { deadline: newDeadline },
            }
          );

          res.status(200).json({
            message: `deadline changed`,
            result: result,
          });
          console.log("updated deadline");
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Error  updating deadline", error });
        }
      } else {
        res.status(401).json({
          message: "Unauthorized access: You are not an admin fucker.",
        });
      }
    }
  )
);

export default handler;
