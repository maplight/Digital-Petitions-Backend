import {
    S3Client,
    ListObjectsV2Command,
    ListObjectsV2CommandInput,
    _Object
} from "@aws-sdk/client-s3";
import type { AssetsEvent } from "./types";
import { extractDate, getResourcePrefix } from "./util";

export async function handleGetCurrentVersion(
    event: AssetsEvent,
    client: S3Client
): Promise<string | null> {
    try {
        const versions: [string, number][] = [];

        const commandInput: ListObjectsV2CommandInput = {
            Bucket: event.bucketId,
            Prefix: getResourcePrefix(event.target)
        };

        do {
            const command = new ListObjectsV2Command(commandInput);

            const results = await client.send(command);

            const items =
                results.Contents?.map((_) => _.Key ?? "").map(
                    (_) => [_, extractDate(_)] as [string, number]
                ) ?? [];

            versions.push(...items);

            if (results.IsTruncated) {
                commandInput.ContinuationToken = results.NextContinuationToken;
            } else {
                commandInput.ContinuationToken = undefined;
            }
        } while (commandInput.ContinuationToken);

        if (versions.length) {
            const [version, _sortKey] = versions.sort(([_i, a], [_j, b]) => a - b).slice(-1)[0];

            return version;
        }
    } catch (err) {
        console.log(err);
    }

    return null;
}
