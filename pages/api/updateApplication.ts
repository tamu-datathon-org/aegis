import { authenticatedRoute } from '../../libs/middleware'
import { MongoDBSingleton } from '../../utils/db';
import { VercelRequest, VercelResponse } from '@vercel/node';
import nextConnect from 'next-connect'

const handler = nextConnect();
handler.post(authenticatedRoute(async (req: VercelRequest, res: VercelResponse, tdUser) => {
  try {
    const db = await MongoDBSingleton.getInstance();
    const data = req.body;
    const result = await db.collection('applications').updateOne(
        { email: tdUser.email },
        { $set: data },
        { upsert: true}
    );
    
    res.status(201).json({
      message: 'Document created successfully',
      result: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating document', error });
  }
}));

export default handler;