import { processVerificationMethod, notifyOfVerification } from "./integration";
import type { VerificationEvent, VerificationResponse, VerificationResult } from "./types";
import { forwardCode, generateCode, METHOD_FAILURE } from "./util";

export async function handleVerification(event: VerificationEvent): Promise<VerificationResponse> {
    let result: VerificationResult;

    try {
        result = await processVerificationMethod(event);

        if (result.error === null) {
            if (result.confirmationRequired) {
                if (!result.code || result.code.length === 0) {
                    result.code = await generateCode();
                }

                await notifyOfVerification(event, result);
                await forwardCode(event, result);
            }
        }
    } catch (err) {
        console.log("Signature verification method failed", err);
        result = METHOD_FAILURE;
    }

    return { ...event, ...result };
}
