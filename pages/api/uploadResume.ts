import { authenticatedRoute } from '../../libs/middleware'
import { MongoDBSingleton } from '../../utils/db';
import { VercelRequest, VercelResponse } from '@vercel/node';
import nextConnect from 'next-connect';
import s3 from '../../utils/aws-config';
import formidable from 'formidable';
import fs from 'fs';

// For preventing header corruption, specifically Content-Length header
export const config = {
    api: {
        bodyParser: false,
    },
}

const handler = nextConnect();
handler.post(authenticatedRoute(async (req: VercelRequest, res: VercelResponse, tdUser) => {
  try {
    const db = await MongoDBSingleton.getInstance();
    const data = req.body;
    const form = formidable();

    form.parse(req, (error, fields, files) => {
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

        s3.putObject({
            Body: fileStream,
            Bucket: "td-2023-resumes",
            Key: `resumes/${tdUser.lastName}_${tdUser.firstName}_resume.pdf`
        }).promise();
  
    });
    
    res.status(201).json({
      message: 'epic gamer document upload',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating document', error });
  }
}));

export default handler;