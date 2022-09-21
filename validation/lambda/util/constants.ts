import type { VoterRecordMatch, VerificationResult } from "../types";
import { VerificationMethod } from "../types";

export const NO_AVAILABLE_METHODS: Record<VerificationMethod, boolean> = {
    [VerificationMethod.Call]: false,
    [VerificationMethod.Mail]: false,
    [VerificationMethod.Text]: false,
    [VerificationMethod.Email]: false,
    [VerificationMethod.StateId]: false
};

/**
 * Default result for when no match is found for
 * a given identity.
 */
export const NO_MATCH: VoterRecordMatch = {
    token: null,
    methods: NO_AVAILABLE_METHODS
};

const BASE_ERROR: Omit<VerificationResult, "error"> = {
    confirmationRequired: false,
    sendTo: "",
    code: ""
};

/**
 * Error result.
 *
 * Use when the requested verification method is not available for the
 * provided identity.
 */
export const METHOD_NOT_AVAILABLE: VerificationResult = {
    ...BASE_ERROR,
    error: "The supplied verification method is not available for this voter"
};

export const METHOD_FAILURE: VerificationResult = {
    ...BASE_ERROR,
    error: "An error occurred while attempting to validate your signature. Please try again later"
};

/**
 * This is 1000 when using base 36 (lower bound for 4 digit numbers)
 */
export const BASE_36X4_LO = 46656;

/**
 * This is ZZZZ when using base 36 (upper bound for 4 digit numbers)
 */
export const BASE_36X4_HI = 1679615;
