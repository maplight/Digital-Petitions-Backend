import { VerificationMethod, type VerificationResult } from "../types";

const mapping: { [K in VerificationMethod]?: (sendTo: string, code: string) => Promise<void> } = {
    [VerificationMethod.Email]: async (a, b) => console.log("email", a, b),
    [VerificationMethod.Text]: async (a, b) => console.log("text message", a, b)
};

export async function forwardCode(
    method: VerificationMethod,
    result: VerificationResult
): Promise<void> {
    return await mapping[method]?.(result.sendTo, result.code);
}
