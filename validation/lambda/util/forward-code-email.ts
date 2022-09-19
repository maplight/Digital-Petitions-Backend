import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import type { VerificationEvent, VerificationResult } from "../types";

const client = new SESv2Client({});

export async function forwardCodeByEmail(
    event: VerificationEvent,
    result: VerificationResult
): Promise<void> {
    try {
        const command = new SendEmailCommand({
            FromEmailAddress: "david.rodriguez@ntsprint.com",
            Destination: {
                ToAddresses: [result.sendTo]
            },
            Content: {
                Simple: {
                    Subject: { Data: "Your signature verification code" },
                    Body: {
                        Text: {
                            Data:
                                `This is your verification code for your signature in support of ${event.title}.\n` +
                                `Code: ${result.code}\n` +
                                "Thanks for using the app!"
                        }
                    }
                }
            }
        });

        await client.send(command);
    } catch (err) {
        console.log("Failed to send email: ", err);
    }
}
