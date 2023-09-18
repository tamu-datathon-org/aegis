import { authenticatedRoute } from '../../libs/middleware'
import { MongoDBSingleton } from '../../utils/db';
import { VercelRequest, VercelResponse } from '@vercel/node';
import nextConnect from 'next-connect';
import s3 from '../../utils/aws-config';


const handler = nextConnect();
handler.post(authenticatedRoute(async (req: VercelRequest, res: VercelResponse, tdUser) => {
  try {
    const db = await MongoDBSingleton.getInstance();
    const data = req.body;

    console.log(data);

    // const params = {
    //     Bucket: 'td-2023-resumes',
    //     Key: `resumes/${data.resume[0].name}.pdf`,
    //     Body: data.resume,
    // };

    console.log(data);
    // s3.putObject(params);
    
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