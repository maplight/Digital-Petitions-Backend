import type { VerificationMethod, VoterMatchEvent, VoterRecordMatch } from "../types";
import { NO_AVAILABLE_METHODS, NO_MATCH } from "../util";
import voters from "../mock/voters.json";

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
    /**
     * Example lookup procedure using static data.
     *
     * Notice that this is a very naive approach, the specifics of how to perform the
     * matching depend on the available data on the system being integrated, though we
     * do not impose any limitations on it beyond the constraints of lambda execution times.
     */

    const match = voters.find(
        (_) => event.fullName.trim().toLowerCase() === _.fullName.toLowerCase()
    );

    if (!match) return NO_MATCH;

    /**
     * Notice how in this sample, match records do not explicitly have
     * the verification method availability as part of the original source
     * data, but it is rather based on what the information stored for a particular
     * record is. In this case, not all records have a valid email address attached to
     * them and thus, while all can be verified by using the STATE_ID method,
     * only some of them can have the code forwarded using email.
     */

    const methods: Record<VerificationMethod, boolean> = {
        ...NO_AVAILABLE_METHODS,
        EMAIL: typeof match.email === "string",
        STATE_ID: true
    };

    return { token: match.token, methods };
}
