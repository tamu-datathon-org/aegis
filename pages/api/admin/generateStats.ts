import { authenticatedRoute } from '../../../libs/middleware'
import { connectToDatabase } from '../../../utils/db';
import { VercelRequest, VercelResponse } from '@vercel/node';
import nextConnect from 'next-connect'

const handler = nextConnect();
handler.get(authenticatedRoute(async (req: VercelRequest, res: VercelResponse, tdUser) => {
  if(tdUser?.isAdmin) {
    try {
        const { db } = await connectToDatabase();
        const result = await db.collection('applications').distinct('name');
        if(result != null)
            res.status(200).json( result );
        else {
            res.status(404).json({ message: 'No people with firstName "bob" were found.' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching people', error });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized access: You are not an admin.' });
  }
}));  

export default handler;