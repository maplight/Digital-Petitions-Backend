import type { PostConfirmationTriggerHandler } from "aws-lambda";

import { getGroups } from "../common";
import { AccessGroupKeys, ACCESS_GROUP_ATTR } from "../common";

import {
    CognitoIdentityProviderClient,
    AdminAddUserToGroupCommand,
    AdminUpdateUserAttributesCommand
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({});

export const handler: PostConfirmationTriggerHandler = async (event): Promise<any> => {
    const groups = await getGroups(event.userPoolId, client);

    let targetGroup = groups[event.request.userAttributes[ACCESS_GROUP_ATTR] as AccessGroupKeys];

    if (typeof targetGroup !== "string") {
        await client.send(
            new AdminUpdateUserAttributesCommand({
                Username: event.userName,
                UserPoolId: event.userPoolId,
                UserAttributes: [
                    {
                        Name: ACCESS_GROUP_ATTR,
                        Value: AccessGroupKeys.Petitioner
                    }
                ]
            })
        );

        targetGroup = groups[AccessGroupKeys.Petitioner];
    }

    const command = new AdminAddUserToGroupCommand({
        GroupName: targetGroup,
        Username: event.userName,
        UserPoolId: event.userPoolId
    });

    await client.send(command);

    return event;
};
