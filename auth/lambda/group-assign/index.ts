import type { PostConfirmationTriggerHandler } from "aws-lambda";
import { AccessGroupKeys, ACCESS_GROUP_ATTR } from "../common";

import {
    CognitoIdentityProviderClient,
    AdminAddUserToGroupCommand
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({});

const mapGroupName = (accessGroup: string): string | undefined => {
    switch (accessGroup as AccessGroupKeys) {
        case AccessGroupKeys.Admin:
            return process.env.ADMIN_GROUP;

        case AccessGroupKeys.CityStaff:
            return process.env.CITY_STAFF_GROUP;

        default:
            return process.env.PETITIONER_GROUP;
    }
};

export default <PostConfirmationTriggerHandler>(async (event): Promise<any> => {
    const targetGroup = mapGroupName(
        event.request.userAttributes[ACCESS_GROUP_ATTR] ?? AccessGroupKeys.Petitioner
    );

    if (typeof targetGroup !== "string") return event;

    const command = new AdminAddUserToGroupCommand({
        GroupName: targetGroup,
        Username: event.userName,
        UserPoolId: event.userPoolId
    });

    try {
        await client.send(command);
    } catch (err) {
        console.log("Failed", err);
    }

    return event;
});
