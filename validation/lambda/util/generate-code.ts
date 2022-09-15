import { VerificationEvent } from "../types";

/**
 * Generate a code to be used as confirmation for signature verification
 * in cases where the signature cannot be immediately verified.
 *
 * @param data a `VerificationEvent` that will be used to source the code
 * @returns a randomly generated code
 */
export async function generateCode(data: VerificationEvent): Promise<string> {
    return "";
}
