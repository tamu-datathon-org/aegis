import { authenticatedRoute } from '../../libs/middleware'
import { connectToDatabase } from '../../utils/db';
import { VercelRequest, VercelResponse } from '@vercel/node';
import nextConnect from 'next-connect'

const handler = nextConnect();
handler.get(authenticatedRoute(async (req: VercelRequest, res: VercelResponse, tdUser) => {
  try {
      const { db } = await connectToDatabase();
      const result = await db.collection('applications').findOne({ email: tdUser.email });
      if(result != null)
        res.status(200).json( result );
      else {
        res.status(404).json({ message: 'Application not found' });
      }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching application', error });
  }
}));  

export default handler;