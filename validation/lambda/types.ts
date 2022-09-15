/**
 * Common types and interfaces, both used as inputs and outputs by the
 * lambda entry point and by the implmentations that must be provided by the
 * system adopters.
 */

/**
 * Actions supported by the lambda.
 *
 * Discriminators for different event types and routing
 * requests to the appropriate handler.
 */
export enum VerificationAction {
    /**
     * The containing event should be a request for
     * matching an identity with the voter record and retrieve available signature
     * verification methods.
     */
    MatchVoter = "match-voter",

    /**
     * The containing event should be a request for
     * processing a verification method request for a previously
     * identified endorser.
     */
    VerifySignature = "validate"
}

/**
 * The set of possible signature verification methods.
 *
 * A particular system might not support some of those methods,
 * in which case it will return `false` for the corresponding entry
 * when a request for matching a voter record is submitted.
 */
export enum VerificationMethod {
    /**
     * Driver's license or state-issued id number.
     *
     * This method may work without additional confirmation.
     */
    StateId = "STATE_ID",

    /**
     * Electronic mailing address registered on the
     * voter record.
     *
     * Additional confirmation in the form of a code will be sent to
     * the address and needs to be input in the system before the signature
     * is considered as verified.
     */
    Email = "EMAIL",

    /**
     * Based on the phone number linked to the voter record.
     *
     * Additional confirmation in the form of a code will be sent to
     * this number as a text message and needs to be input in the system
     * before the signature is considered as verified.
     */
    Text = "TEXT",

    /**
     * Based on the phone number linked to the voter record.
     */
    Call = "CALL",

    /**
     * Physical mailing address linked to the voter record.
     *
     * Additional confirmation in the form of a code will be sent to
     * this location and needs to be input in the system before the signature
     * is considered as verified.
     */
    Mail = "POSTAL"
}

/**
 * Voter data that is used for the matching and verification
 * process.
 *
 * This is the information that is provided by a user when
 * endorsing a petition.
 */
export type VoterData = {
    /**
     * The voter's full name, as entered on the
     * endorsement form.
     */
    fullName: string;

    /**
     * The voter's address, as entered on the
     * endorsement form.
     */
    address: string;

    /**
     * The voter's city of residence, as entered on the
     * endorsement form.
     */
    city: string;

    /**
     * The voter's state/province of residence, as entered on the
     * endorsement form.
     */
    state: string;

    /**
     * The voter's ZIP code, as entered on the
     * endorsement form.
     */
    zipCode: string;
};

/**
 * Mix-in type for request and response items that reference
 * an existing voter record.
 */
export type VoterToken = {
    /**
     * A unique identifier for a voter record.
     *
     * This value should always be the same as long as the
     * provided data matches the same voter record on the external system.
     *
     * A `null` value for this field means that there was no match on the
     * voter record for the provided info.
     *
     * This value may be passed back for further work when requesting to
     * apply a signature validation method, in case the external system being
     * adapted can use it to cache or otherwise improve performance/results.
     */
    token: string | null;
};

/**
 * Full reference to a voter record.
 */
export type VoterInfo = VoterToken & VoterData;

/**
 * Request/event contents for voter validation.
 */
export type VoterMatchEvent = VoterData & {
    /**
     * The type of this event
     */
    type: VerificationAction.MatchVoter;
};

/**
 * Type for specifying available signature verification methods for
 * a voter record.
 */
export type MethodAvailibility = {
    /**
     * A map of available signature verification methods for this voter.
     *
     * A voter record might not have the required data available for some
     * verification methods to work, or these might not be valid based on local
     * regulations, in which case it should have a value of `false` for all
     * non-applicable methods and `true` for all applicable ones.
     */
    methods: Record<VerificationMethod, boolean>;
};

/**
 * A voter record match, containing both an identifier and verification
 * method availability.
 */
export type VoterRecordMatch = VoterToken & MethodAvailibility;

/**
 * Response contents for voter validation.
 *
 * Should echo the contents of the request (personal data, excluding type),
 * and include a unique opaque identifier and a map of available
 * signature validation methods for the voter record.
 */
export type VoterMatchResponse = VoterData & VoterRecordMatch;

/**
 * Mix-in type for requests that contain data
 * for applying a signature verification method.
 */
export type VerificationMethodRequest = {
    /**
     * The verification method that will be used for
     * this signature.
     */
    method: VerificationMethod;

    /**
     * Optional arguments for verification
     * methods that require additional input, such
     * as the driver's license/state id.
     */
    methodPayload?: string[];
};

/**
 * Request/event contents for signature validation.
 */
export type VerificationEvent = VoterInfo &
    VerificationMethodRequest & {
        /**
         * The type of this event.
         */
        type: VerificationAction.VerifySignature;
    };

/**
 * The result of applying a verification request to signature data.
 * Should indicate success by having `error` equal `null`.
 */
export type VerificationResult = {
    /**
     * Error indicator.
     *
     * `null` if no error happened.
     */
    error: string | null;

    /**
     * Whether additional confirmation is required
     * before the signature is marked as verified.
     */
    confirmationRequired: boolean;

    /**
     * Multipurpose field.
     * Contents depend on the signature validation method that produced
     * this result:
     *
     * - for `Email`, this should be the email address the code should be forwarded
     *   to (as retrieved from the voter record).
     * - for `Text` and `Call`, this should be the phone number linked to the
     *   voter record and that will receive the SMS or call.
     * - for `Mail`, this should be the physical mailing address that the code
     *   is to be mailed to (as retrieved from the voter record).
     * - for `StateId`, this field should be left empty.
     */
    sendTo: string;

    /**
     * The code the voter must input into the system to
     * complete the signature validation when additional confirmation
     * is required.
     *
     * This value should be generated as part of the request handling and
     * the system adopter is not required to fill it.
     *
     * This value may be empty if no confirmation is required.
     */
    code: string;
};

/**
 * Response contents for signature validation.
 *
 * If the requested method supported it and was successful, this result may
 * indicate that no further action is required by setting the `confirmationRequired`
 * property to `false`.
 *
 * Something other than `null` present on the `error` field indicates that the validation
 * process failed. Otherwise, in cases where additional actions are required, `confirmationRequired`
 * will be `true` and the `code` property will be set to the code the voter must input on the
 * system in order to complete the signature verification.
 */
export type VerificationResponse = VoterInfo & VerificationMethodRequest & VerificationResult;

export type AdapterEvent = VoterMatchEvent | VerificationEvent;
export type AdapterResponse = VoterMatchResponse | VerificationResponse;
