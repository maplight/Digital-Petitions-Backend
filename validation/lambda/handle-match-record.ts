import { findRecordMatch } from "./integration/find-record-match";
import { VoterMatchEvent, VoterMatchResponse, VoterRecordMatch } from "./types";
import { NO_MATCH } from "./util";

/**
 * Handler for events/requests for matching provided endorser data
 * with an external voter record.
 *
 * System adopters are expected to provide an implementation for the `findRecordMatch`
 * function in order for this handler to work correctly.
 * 
 * By default, all the data contained on the source event should be
 * echoed back as part of the response. Additionally, the return value from
 * `findRecordMatch` will be merged in to create the response. In case an exception
 * occurs during the call, a default response similar to the one expected when
 * no match is found will be constructed and sent back, and the inner exception
 * will be logged.
 *
 * @param event the event that triggered this handler
 * @returns a `VoterMatchResponse` containing match and validation details
 */
export async function handleMatchVoter(event: VoterMatchEvent): Promise<VoterMatchResponse> {
    let response: VoterRecordMatch;

    try {
        response = await findRecordMatch(event);
    } catch (err) {
        console.log("Error during voter record matching", err);

        response = NO_MATCH;
    }

    return { ...event, ...response };
}
