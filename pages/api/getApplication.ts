import { authenticatedRoute } from '../../libs/middleware'
import { MongoDBSingleton } from '../../utils/db';
import { VercelRequest, VercelResponse } from '@vercel/node';
import nextConnect from 'next-connect'

const handler = nextConnect();
handler.get(authenticatedRoute(async (req: VercelRequest, res: VercelResponse, tdUser) => {
    const db = await MongoDBSingleton.getInstance();
    try {
    const result = await db.collection('applications').findOne({ email: tdUser.email });
    if(result != null)
      res.status(200).json( result );
    else {
      res.status(404).json({ message: 'Application not found' });
    }
    await MongoDBSingleton.closeConnection();
  } catch (error) {
    await MongoDBSingleton.closeConnection();
    console.log(error);
    res.status(500).json({ message: 'Error fetching application', error });
  }
}));

export default handler;