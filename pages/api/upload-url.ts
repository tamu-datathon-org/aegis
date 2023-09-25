import s3 from '../../utils/aws-config';
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const post = await s3.createPresignedPost({
    Bucket: "td-2023-resumes",
    Fields: {
      key: req.query.file,
      'Content-Type': req.query.fileType,
    },
    Expires: 60, // seconds
    Conditions: [
      ['content-length-range', 0, 1048576*10], // up to 10 MB
    ],
  })

  res.status(200).json(post)
}