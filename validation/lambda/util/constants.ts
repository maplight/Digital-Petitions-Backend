import type {
    MethodAvailibility,
    VoterRecordMatch,
    VerificationResult
} from "../types";
import { VerificationMethod } from "../types";

export const NO_AVAILABLE_METHODS: MethodAvailibility = {
    methods: {
        [VerificationMethod.Call]: false,
        [VerificationMethod.Mail]: false,
        [VerificationMethod.Text]: false,
        [VerificationMethod.Email]: false,
        [VerificationMethod.StateId]: false
    }
};

export const NO_MATCH: VoterRecordMatch = {
    token: null,
    ...NO_AVAILABLE_METHODS
};

const BASE_ERROR: Omit<VerificationResult, "error"> = {
    confirmationRequired: false,
    sendTo: "",
    code: ""
};

export const METHOD_NOT_AVAILABLE: VerificationResult = {
    ...BASE_ERROR,
    error: "The supplied verification method is not available for this voter"
};

export const METHOD_FAILURE: VerificationResult = {
    ...BASE_ERROR,
    error: "An error occurred while attempting to validate your signature. Please try again later"
};
