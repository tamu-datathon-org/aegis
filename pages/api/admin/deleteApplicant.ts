import { authenticatedRoute } from '../../../libs/middleware'
import clientPromise from '../../../utils/db';
import { VercelRequest, VercelResponse } from '@vercel/node';
import nextConnect from 'next-connect'

const handler = nextConnect();
handler.post(authenticatedRoute(async (req: VercelRequest, res: VercelResponse, tdUser) => {
    if(tdUser?.isAdmin) {
        let client;
        try {
            client = await clientPromise;
            const db = client.db();
            const data = req.body;

            // make sure there's only 1 key in the body (email) and that it exists
            if (data === null || data.email === null) {
                res.status(400).json({ message: 'No email provided or body has too many keys' });
            }
            else {
                // const result = await db.collection('applications').deleteOne({ email: data.email });
                // res.status(200).json({message: `Successfully delete ${data.email} applicant`, result: result});
            }

        } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error deleting applicant', error });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized access: You are not an admin fucker.' });
    }
}));  

export default handler;