import { VerificationEvent, VerificationMethod, type VerificationResult } from "../types";
import { forwardCodeByEmail } from "./forward-code-email";

const mapping: {
    [K in VerificationMethod]?: (
        request: VerificationEvent,
        result: VerificationResult
    ) => Promise<void>;
} = {
    [VerificationMethod.Email]: forwardCodeByEmail,
    [VerificationMethod.Text]: async (a, b) =>
        console.log("Text Message (Not yet implemented)", a, b)
};

export async function forwardCode(
    event: VerificationEvent,
    result: VerificationResult
): Promise<void> {
    return await mapping[event.method]?.(event, result);
}
