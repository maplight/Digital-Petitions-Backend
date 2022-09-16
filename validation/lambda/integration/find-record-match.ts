import { VoterMatchEvent, VoterRecordMatch } from "../types";
import { NO_MATCH } from "../util";

/**
 * Integration point for system adopters.
 *
 * This function is expected to interface with an external system (voter registry) and use
 * the data provided by the E-Signatures app to identify a voter. 
 * 
 * If no match is found for the provided data, the `NO_MATCH` value can be returned.
 * Otherwise, this function is expected to return an object matching the interface defined by `VoterRecordMatch`,
 * subject to the following:
 * 
 * - The `token` field should uniquely identify the voter record match and is used for caching purposes and 
 * further communication between the E-Signatures API and the external system.
 * This value is sent to the client as part of the validation process so it should not expose sensitive 
 * data or be human-readable if possible.
 * 
 * - The `methods` field should map valid signature verification methods (as defined by the `VerificationMethod` enumeration)
 * to boolean values, indicating which of them (if any) can be used to validate a signature submitted by
 * the matched voter. If no method can be used to validate the signature, the `NO_AVAILABLE_METHODS` constant can be
 * used for this field.
 *
 * @param event the event that triggered this handler; contains voter data to match
 * @returns a `VoterRecordMatch` identifying the voter and available signature verification methods
 */
export async function findRecordMatch(event: VoterMatchEvent): Promise<VoterRecordMatch> {
    return NO_MATCH;
}
