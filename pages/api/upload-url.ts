import s3 from '../../utils/aws-config';
import { NextApiRequest, NextApiResponse } from 'next'
import { MongoDBSingleton } from '../../utils/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if(req.query.fileType == 'application/pdf') {
        const db = await MongoDBSingleton.getInstance();
        const collection = db.collection('applications');

        console.log(req.query);

        const post = await s3.createPresignedPost({
            Bucket: "td-2023-resumes",
            Fields: {
            key: req.query.firstName + "_" + req.query.lastName + "_Resume" + ".pdf",
            'Content-Type': req.query.fileType,
            },
            Expires: 60, // seconds
            Conditions: [
            ['content-length-range', 0, 1048576], // up to 1 MB
            ],
        })
        MongoDBSingleton.closeConnection();
        res.status(200).json(post);
    } else {
        res.status(500).json({ message: 'Error creating document' });
    }

}