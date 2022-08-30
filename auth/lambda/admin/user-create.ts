import {
    AdminAddUserToGroupCommand,
    AdminCreateUserCommand,
    CognitoIdentityProviderClient
} from "@aws-sdk/client-cognito-identity-provider";
import { ACCESS_GROUP_ATTR, getGroups } from "../common";
import type { NewUserEvent } from "./types";
import { emailToUserName } from "./util";

export async function handleCreateUser(
    event: NewUserEvent,
    client: CognitoIdentityProviderClient
): Promise<void> {
    const createCommand = new AdminCreateUserCommand({
        UserPoolId: event.userPoolId,
        Username: emailToUserName(event.email),
        DesiredDeliveryMediums: ["EMAIL"],

        UserAttributes: [
            { Name: "given_name", Value: event.firstName },
            { Name: "family_name", Value: event.lastName },
            { Name: ACCESS_GROUP_ATTR, Value: event.permissions },
            { Name: "email_verified", Value: "True" },
            { Name: "email", Value: event.email }
        ]
    });

    const results = await client.send(createCommand);

    if (!results.User) throw new Error("UserCreateFailed");

    const groups = await getGroups(event.userPoolId, client);

    const addToGroupCommand = new AdminAddUserToGroupCommand({
        UserPoolId: event.userPoolId,
        Username: results.User.Username,
        GroupName: groups[event.permissions]
    });

    await client.send(addToGroupCommand);
}
