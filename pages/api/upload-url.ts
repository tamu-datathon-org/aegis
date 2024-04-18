// import s3 from '../../utils/aws-config';
// import {VercelRequest, VercelResponse} from '@vercel/node';
// import nextConnect from 'next-connect'
// import {authenticatedRoute} from '../../libs/middleware'

// const handler = nextConnect();
//
// // handler.get(authenticatedRoute(async (req: VercelRequest, res: VercelResponse, tdUser) => {
// //     if (req.query.fileType == 'application/pdf') {
// //         // const db = await MongoDBSingleton.getInstance();
// //         // const collection = db.collection('applications');
// //
// //         // const post = await s3.createPresignedPost({
// //         //     Bucket: "td-2023-resumes",
// //         //     Fields: {
// //         //         key: tdUser.authId + "_Resume" + ".pdf",
// //         //         'Content-Type': req.query.fileType,
// //         //     },
// //         //     Expires: 60, // seconds
// //         //     Conditions: [
// //         //         ["content-length-range", 0, 1048576], // up to 1 MB
// //         //     ],
// //         // })
// //         // MongoDBSingleton.closeConnection();
// //         // res.status(200).json(post);
// //     } else {
// //         res.status(500).json({message: 'Error creating document'});
// //     }
// //
// // }));
//
// export default handler;