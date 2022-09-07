import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";
import type { CheckItemValidEvent, ValidationCheck } from "./types";

export async function handleCheckIsValid(
    event: CheckItemValidEvent,
    client: S3Client
): Promise<ValidationCheck> {
    const inError: string[] = [];

    for (const item of event.targets) {
        const command = new HeadObjectCommand({
            Bucket: event.bucketId,
            Key: item
        });

        try {
            await client.send(command);
        } catch (err) {
            inError.push(item);
        }
    }

    return inError.length ? { failed: true, inError } : { failed: false };
}
