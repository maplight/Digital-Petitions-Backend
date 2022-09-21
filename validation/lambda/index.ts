import type { Handler } from "aws-lambda";
import { handleMatchVoter } from "./handle-match-record";
import { handleVerification } from "./handle-verify";
import { VerificationAction, type AdapterEvent, type AdapterResponse } from "./types";

export const handler: Handler<AdapterEvent, AdapterResponse> = async (
    event
): Promise<AdapterResponse> => {
    switch (event.type) {
        case VerificationAction.MatchVoter:
            return await handleMatchVoter(event);

        case VerificationAction.VerifySignature:
            return await handleVerification(event);
    }
};
