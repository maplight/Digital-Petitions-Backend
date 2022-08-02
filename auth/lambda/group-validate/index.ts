import type { PreSignUpTriggerHandler } from "aws-lambda";
import { AccessGroupKeys, ACCESS_GROUP_ATTR } from "../common";

const allowedAccessGroups: AccessGroupKeys[] = [
    AccessGroupKeys.Petitioner,
    AccessGroupKeys.Admin,
    AccessGroupKeys.CityStaff
];

const isAllowed = (value: string): boolean =>
    allowedAccessGroups.includes(value as AccessGroupKeys);

export default <PreSignUpTriggerHandler>(async (event): Promise<any> => {
    if (
        event.triggerSource !== "PreSignUp_AdminCreateUser" ||
        !isAllowed(event.request.userAttributes[ACCESS_GROUP_ATTR])
    ) {
        event.request.userAttributes[ACCESS_GROUP_ATTR] = AccessGroupKeys.Petitioner;
    }

    return event;
});
