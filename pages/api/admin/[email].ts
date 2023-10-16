import { authenticatedRoute } from '../../../libs/middleware'
import clientPromise from '../../../utils/db';
import { VercelRequest, VercelResponse } from '@vercel/node';
import nextConnect from 'next-connect'

const handler = nextConnect();
handler.get(authenticatedRoute(async (req: VercelRequest, res: VercelResponse, tdUser) => {
    if(tdUser?.isAdmin) {

        let client;
        try {
            client = await clientPromise;
            const db = client.db();

            const participantEmail = decodeURI(req.query.email as string);

            const result = await db.collection('applications').findOne({ email: participantEmail });
            if(result != null)
                res.status(200).json( result );
            else {
                res.status(404).json({ message: 'Application not found' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error fetching application', error });
        } finally {
        }


    } else {
        res.status(401).json({ message: 'Unauthorized access: You are not an admin fucker.' });
    }
}));

export default handler;