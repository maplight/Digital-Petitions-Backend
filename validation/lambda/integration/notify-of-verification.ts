import type { VerificationEvent, VerificationResult } from "../types";

/**
 * Integration point for system adopters.
 *
 * This function can be used to forward a notification or run custom logic when
 * a verification method requires so.
 *
 * Example uses cases would be interfacing with a system for placing mail orders
 * or sending a notification when someone needs to physically call the signature
 * endorser to deliver their code.
 *
 * @param event the event that triggered this handler
 * @param result the result of the signature verification process
 */
export async function notifyOfVerification(
    event: VerificationEvent,
    result: VerificationResult
): Promise<void> {}
