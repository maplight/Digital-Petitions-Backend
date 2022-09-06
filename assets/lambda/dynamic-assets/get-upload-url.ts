import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getNewResourceTargetFile, ONE_HOUR } from "./util";

import type { SingleItemEvent } from "./types";

export async function handleGetUploadUrl(
    event: SingleItemEvent,
    client: S3Client
): Promise<string | null> {
    try {
        const command = new PutObjectCommand({
            Bucket: event.bucketId,
            Key: getNewResourceTargetFile(event.target)
        });

        const url = await getSignedUrl(client, command, { expiresIn: ONE_HOUR });

        return url;
    } catch (err) {
        console.log(err);
    }

    return null;
}
