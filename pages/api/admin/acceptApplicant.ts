import { authenticatedRoute } from '../../../libs/middleware'
import clientPromise from '../../../utils/db';
import { VercelRequest, VercelResponse } from '@vercel/node';
import nextConnect from 'next-connect'
import Mailgun from 'mailgun-js'
import QRCode from 'qrcode'

const handler = nextConnect();
handler.post(authenticatedRoute(async (req: VercelRequest, res: VercelResponse, tdUser) => {
    if(tdUser?.isAdmin) {
        let client;
        try {
            client = await clientPromise;
            const db = client.db();
            const data = req.body;

            // make sure there's only 1 key in the body (email) and that it exists
            if (data === null || data.email === null || data.firstName === null || data.lastName === null) {
                res.status(400).json({ message: 'No email provided or body has too many keys' });
            }
            else {
                const result = await db.collection('applications').updateOne(
                    { email: data.email },
                    {
                        $set: {
                            appStatus: 'Accepted'
                        }
                    }
                );

                // send email to applicant (data.email)
                const mailgun = Mailgun({
                    apiKey: process.env.MAILGUN_API_KEY!,
                    domain: process.env.MAILGUN_DOMAIN!
                });

                const acceptanceEmailContent = `
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
                                <h2 style="margin-bottom: 20px; font-size: 16px; color: black">Congratulations! You're Accepted to TAMU Datathon Lite!</h2>
                                <p style="line-height: 20px; -webkit-font-smoothing: antialiased;
                                    font-weight: normal;
                                    color: black;
                                    margin-bottom: 20px;">
                                    Dear ${data.firstName},<br>
                                    Congratulations! We are pleased to inform you that your application to participate in TAMU Datathon has been accepted. We are excited to have you join us for this exciting event!<br>
                                    Here are some important details:
                                </p>
                                <ul>
                                    <li><strong>Time:</strong> April 20th, 8 AM - 5 PM</li>
                                    <li><strong>Location:</strong> <a href="https://www.google.com/maps/dir//Innovative+Learning+Classroom+Building+(ILCB),+215+Lamar+St,+College+Station,+TX+77844/@30.612059,-96.3856971,13z/data=!4m8!4m7!1m0!1m5!1m1!1s0x864683e0796a3d63:0xdd0440b15e5686a7!2m2!1d-96.3444972!2d30.6119916?entry=ttu">Innovative Learning Classroom Building (ILCB)</a></li>
                                </ul>
                                <p style="line-height: 20px; -webkit-font-smoothing: antialiased;
                                    font-weight: normal;
                                    color: black;
                                    margin-bottom: 20px;">
                                    Please join our <a href="https://tamudatathon.com/guild">Discord</a> to receive updates for our event!
                                </p>
                                <p style="line-height: 20px; -webkit-font-smoothing: antialiased;
                                    font-weight: normal;
                                    color: black;
                                    margin-bottom: 20px;">
                                    We look forward to seeing you at the hackathon. If you have any questions or concerns, please don't hesitate to contact us at <a href="mailto:connect@tamudatathon.com">connect@tamudatathon.com</a>
                                </p>
                                <p style="line-height: 20px; -webkit-font-smoothing: antialiased;
                                font-weight: normal;
                                color: black;
                                margin-bottom: 20px;">
                                Additionally, we have attached a QR code to this email. This QR code will be used for your check-in at the event on the day of. Please ensure to have it ready for a smooth check-in process.
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

                const qrCodeData = { email: data.email, firstName: data.firstName, lastName: data.lastName, appStatus: 'Accepted' };
                const qrCodeBuffer = await QRCode.toBuffer(JSON.stringify(qrCodeData));  
                // console.log(qrCodeData);
                
                const qrCodeAttachment = new mailgun.Attachment({
                    data: qrCodeBuffer,
                    filename: 'qrCode.png',
                    contentType: 'image/png'
                });

                const mailData = {
                    from: 'TAMU Datathon <connect@tamudatathon.com>',
                    to: data.email,
                    subject: 'TAMU Datathon 2024 Application Accepted!',
                    html: acceptanceEmailContent,
                    attachment: [qrCodeAttachment]
                };
                mailgun.messages().send(mailData, (error, body) => {
                    if (error) {
                        console.log(error);
                    }
                });

                // Add the user to the mailing list
                const mailingListAddress = '2024_accepted_applicants@mg.tamudatathon.com';
                const member = {
                    subscribed: true,
                    address: data.email,
                    name: `${data.firstName} ${data.lastName}`
                };

                mailgun.lists(mailingListAddress).members().create(member, (error, body) => {
                    if (error) {
                        console.log(`Error adding ${data.email} to the mailing list:`, error);
                    } else {
                        console.log(`${data.email} added to the mailing list:`);
                    }
                });

                console.log(`Accepted ${data.email}`)

                res.status(200).json({message: `${data.email} applicant accepted`, result: result});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error accepting applicant', error });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized access: You are not an admin fucker.' });
    }
}));

export default handler;