import { authenticatedRoute } from '../../libs/middleware'
import { MongoDBSingleton } from '../../utils/db';
import { VercelRequest, VercelResponse } from '@vercel/node';
import nextConnect from 'next-connect';
import s3 from '../../utils/aws-config';
import formidable from 'formidable';
import fs from 'fs';
import axios from 'axios';
import { WithId, Document } from 'mongodb';

// For preventing header corruption, specifically Content-Length header
export const config = {
    api: {
        bodyParser: false,
    },
}

const generateUniqueResumeKey = async (s3: import("aws-sdk/clients/s3"), bucket: string, baseKey: string, user: WithId<Document> | null) => {
    let resumeKey = baseKey;
    let suffix = 1;
  
    while (true) {
      try {
        // Check if the key already exists in the S3 bucket
        await s3.headObject({ Bucket: bucket, Key: resumeKey }).promise();
  
        if(user?.resumeKey == resumeKey) {
            break;
        }
        // If it exists, generate a new key with a suffix
        const [baseName, extension] = resumeKey.split('.');
        resumeKey = `${baseName}-${suffix}.${extension}`;
        suffix++;
      } catch (error) {
        // Key doesn't exist, so it's unique
        break;
      }
    }
  
    return resumeKey;
  };

const handler = nextConnect();
handler.post(authenticatedRoute(async (req: VercelRequest, res: VercelResponse, tdUser) => {
  try {
    var resumeKey;
    const db = await MongoDBSingleton.getInstance();
    const data = req.body;
    const form = formidable();

    form.parse(req, async (error, fields, files) => {
        if (error) {
          console.error('Error parsing form data:', error);
          res.status(500).json({ error: 'Server error' });
          return;
        }

        // Check if a file was uploaded
        if (!files.resume) {
            console.error('No file uploaded');
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        if (files.resume[0].mimetype !== 'application/pdf') {
            console.error('Uploaded file is not a PDF');
            res.status(400).json({ error: 'Uploaded file is not a PDF' });
            return;
        }

        const fileStream = fs.createReadStream(files.resume[0].filepath);

        const collection = db.collection('applications');

        const user = await collection.findOne({ email: tdUser.email });
        const baseResumeKey = `resumes/${user?.firstName}_${user?.lastName}_resume.pdf`;
        const resumeKey = await generateUniqueResumeKey(s3, "td-2023-resumes", baseResumeKey, user);      

        await s3.putObject({
            Body: fileStream,
            Bucket: "td-2023-resumes",
            Key: resumeKey
        }).promise();
        
        const document = {resumeKey: resumeKey};
        const result = await collection.updateOne(
            { email: tdUser.email },
            { $set: document },
            { upsert: true}
        );

        // Clean up the temporary file
        fs.unlinkSync(files.resume[0].filepath);
  
    });
    
    res.status(201).json({
      message: resumeKey,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating document', error });
  }
}));

export default handler;