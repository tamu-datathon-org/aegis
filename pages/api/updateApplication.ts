import Client from 'mailgun.js/client';
import { authenticatedRoute } from '../../libs/middleware'
import clientPromise from '../../utils/db';
import { VercelRequest, VercelResponse } from '@vercel/node';
import nextConnect from 'next-connect';

const handler = nextConnect();
handler.post(authenticatedRoute(async (req: VercelRequest, res: VercelResponse, tdUser) => {
    let client;
    try {
        client = await clientPromise;
        const db = client.db();
        const data = req.body;
        
        // const result = await db.collection('applications').updateOne(
        //     { email: tdUser.email },
        //     { $set: data },
        //     { upsert: true}
        // );
        
        // res.status(201).json({
        // message: 'Document created successfully',
        // result: result,
        // });

        res.status(201).json({ message: 'Applications are closed!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating document', error });
    }
}));

export default handler;