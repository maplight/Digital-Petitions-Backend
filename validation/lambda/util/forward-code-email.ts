import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import type { VerificationEvent, VerificationResult } from "../types";

const client = new SESv2Client({});

export async function forwardCodeByEmail(
    event: VerificationEvent,
    result: VerificationResult
): Promise<void> {
    try {
        const command = new SendEmailCommand({
            FromEmailAddress: process.env.EMAIL_IDENTITY,
            Destination: {
                ToAddresses: [result.sendTo]
            },
            Content: {
                Template: {
                    TemplateName: "VerificationCodeTemplate",
                    TemplateData: JSON.stringify({ PETITION: event.title, CODE: result.code })
                }
            }
        });

        await client.send(command);
    } catch (err) {
        console.log("Failed to send email: ", err);
    }
}
