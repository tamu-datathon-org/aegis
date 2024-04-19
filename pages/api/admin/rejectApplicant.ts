import { authenticatedRoute } from '../../../libs/middleware'
import clientPromise from '../../../utils/db';
import { VercelRequest, VercelResponse } from '@vercel/node';
import nextConnect from 'next-connect'
import Mailgun from 'mailgun-js'

const handler = nextConnect();
handler.post(authenticatedRoute(async (req: VercelRequest, res: VercelResponse, tdUser) => {
    if(tdUser?.isAdmin) {
        let client;
        try {
            client = await clientPromise;
            const db = client.db();
            const data = req.body;

            // make sure there's only 1 key in the body (email) and that it exists
            if (data === null || data.email === null) {
                res.status(400).json({ message: 'No email provided or body has too many keys' });
            }
            else {
                const result = await db.collection('applications').updateOne(
                    { email: data.email },
                    {
                        $set: {
                            appStatus: 'Rejected'
                        }
                    }
                );

                // send email to applicant (data.email)
                const mailgun = Mailgun({
                    apiKey: process.env.MAILGUN_API_KEY!,
                    domain: process.env.MAILGUN_DOMAIN!
                });

                const rejectionEmailContent = `
                    <html>
                        <body>
                            <div style="max-width:800px; background-color: #68d1ff; z-index: -1; position: absolute; top: 0; left: 0; padding: 20px">
                                <div style="font-family: 'Questrial', sans-serif;
                                    background: #fff;
                                    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.1);
                                    border-radius: 3px;
                                    padding: 20px 30px !important;
                                    max-width: 500px;
                                    display: block;
                                    margin: 20px auto;">
                                    <h2 style="margin-bottom: 20px; font-size: 16px; color: black">Thank You for Your Application to TAMU Datathon Lite</h2>
                                    <p style="line-height: 20px; -webkit-font-smoothing: antialiased;
                                        font-weight: normal;
                                        color: black;
                                        margin-bottom: 20px;">
                                        Dear ${data.firstName},<br>
                                        Thank you for applying to participate in TAMU Datathon. We appreciate your interest and effort in applying to be part of this event. After careful consideration, we regret to inform you that your application has not been accepted for this year's Datathon.
                                    </p>
                                    <p style="line-height: 20px; -webkit-font-smoothing: antialiased;
                                        font-weight: normal;
                                        color: black;
                                        margin-bottom: 20px;">
                                        We understand that this may be disappointing, and we encourage you to continue pursuing your passion for data science and technology. TAMU Datathon hopes to see your application again in the future.
                                    </p>
                                    <p style="line-height: 20px; -webkit-font-smoothing: antialiased;
                                        font-weight: normal;
                                        color: black;
                                        margin-bottom: 20px;">
                                        If you have any questions or would like feedback on your application, please feel free to reach out to us at <a href="mailto:connect@tamudatathon.com">connect@tamudatathon.com</a>.
                                    </p>
                                    <p style="line-height: 20px; -webkit-font-smoothing: antialiased;
                                        font-weight: normal;
                                        color: black;
                                        margin-bottom: 20px;">
                                        Thank you for your understanding, and we wish you the best in your future endeavors.
                                    </p>
                                    <p style="line-height: 20px; -webkit-font-smoothing: antialiased;
                                        font-weight: normal;
                                        color: black;
                                        margin-bottom: 20px;">
                                        Best regards,<br>
                                        The TAMU Datathon Team
                                    </p>
                                </div>
                            </div>
                        </body>
                    </html>
                `;

                const mailData = {
                    from: 'TAMU Datathon <connect@tamudatathon.com>',
                    to: data.email,
                    subject: 'Application Status for TAMU Datathon 2024',
                    html: rejectionEmailContent,
                };

                mailgun.messages().send(mailData, (error, body) => {
                    if (error) {
                        console.log(error);
                        res.status(500).json({ message: 'Error sending email', error });
                    }
                    else {
                        console.log(body);
                        res.status(200).json({ message: `${data.email} applicant rejected`, result: result });
                    }
                });
            
                res.status(200).json({message: `${data.email} applicant accepted`, result: result});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error rejecting applicant', error });
        }
    } else {
        res.status(401).json({ message: '\"I\'m admin! I\'m admin!\"\nNo you ain\'t.'});
    }
}));

export default handler;