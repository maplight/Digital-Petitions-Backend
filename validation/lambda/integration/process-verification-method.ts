import { VerificationEvent, VerificationResult } from "../types";
import { METHOD_NOT_AVAILABLE } from "../util";

/**
 * Integration point for system adopters.
 *
 * This function is expected to interface with an external system (voter record) and use
 * the data provided by the E-Signatures app to immediately validate the signature
 * (if the chosen method allows so) or return enough information to get the verification
 * code to the user.
 *
 * This function is passed the same data that was originally used to determine the available
 * verification methods for the voter record match, as well as the identifier that was returned
 * as part of that response, in case the adopter's system can use that value to more effectively
 * lookup the requested information. The event also contains the requested verification method
 * and optional information that it might use (such is the case for `StateId`) as an array of
 * strings.
 * 
 * This function is expected to return an object matching the interface defined by `VerificationResult`,
 * subject to the following:
 * 
 * - The `error` field should be set to some non-null string if the validation failed for whatever
 * reason, in which case the rest of fields in the result will be disregarded and the contents of
 * the field will be forwarded to the API (and ultimately to the client app). If the verification
 * succeeded (or can continue but requires additional confirmation), `error` should be set to `null`.
 * 
 * - The `confirmationRequired` field may be set to `false` if the provided data was deemed sufficient to
 * validate the signature using the requested method. This will indicate the E-Signatures app that
 * no further action is required on the user's side. Otherwise, setting this value to `true` will trigger
 * additional logic for delivering a confirmation code to the user, who will be able to then use it to
 * complete their signature verification.
 * 
 * - The `sendTo` field should be set to an appropriate value based on the requested verification method.
 * Please check the field's documentation for further details on the expected values for each verification method.
 *
 * - Generating the value for the `code` field is handled by the E-Signtures app, so system adopters need not
 * fill this field. Though, should they wish to use their own method for
 * generating the code, they may override the base behavior by setting `code` to a non-empty
 * string value. Doing so will skip code generation and use the provided value.
 *
 * @param event the event that triggered this handler
 * @returns a `VerificationResult`
 */
export async function processVerificationMethod(event: VerificationEvent): Promise<VerificationResult> {
    return METHOD_NOT_AVAILABLE;
}
