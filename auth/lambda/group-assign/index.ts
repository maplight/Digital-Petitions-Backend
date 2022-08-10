import type { PostConfirmationTriggerHandler } from "aws-lambda";

import type { GroupNameLookup } from "../common";
import { AccessGroupKeys, ACCESS_GROUP_ATTR } from "../common";

import {
    CognitoIdentityProviderClient,
    AdminAddUserToGroupCommand,
    AdminUpdateUserAttributesCommand,
    ListGroupsCommand
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({});

const getGroups = async (userPool: string): Promise<GroupNameLookup> =>
    (await client.send(new ListGroupsCommand({ UserPoolId: userPool }))).Groups?.map(
        (_) => _.GroupName ?? "Unknown"
    )?.reduce((dict, group) => {
        if (group.indexOf("Petitioner") >= 0) {
            dict[AccessGroupKeys.Petitioner] = group;
        } else if (group.indexOf("CityStaff") >= 0) {
            dict[AccessGroupKeys.CityStaff] = group;
        } else if (group.indexOf("Admin") >= 0) {
            dict[AccessGroupKeys.Admin] = group;
        }

        return dict;
    }, {} as GroupNameLookup) ?? {};

export const handler: PostConfirmationTriggerHandler = async (event): Promise<any> => {
    const groups = await getGroups(event.userPoolId);

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
