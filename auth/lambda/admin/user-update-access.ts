import {
    AdminAddUserToGroupCommand,
    AdminDisableUserCommand,
    AdminEnableUserCommand,
    AdminGetUserCommand,
    AdminListGroupsForUserCommand,
    AdminRemoveUserFromGroupCommand,
    AdminUpdateUserAttributesCommand,
    CognitoIdentityProviderClient
} from "@aws-sdk/client-cognito-identity-provider";
import { ACCESS_GROUP_ATTR, getGroups } from "../common";
import type { UpdateUserAccessEvent, User, Option } from "./types";
import { attributeListToUser } from "./util";

export async function handleUpdateUserAccess(
    event: UpdateUserAccessEvent,
    client: CognitoIdentityProviderClient
): Promise<Option<User>> {
    try {
        const common = { UserPoolId: event.userPoolId, Username: event.username };

        const getUserCommand = new AdminGetUserCommand(common);
        const user = await client.send(getUserCommand);

        if (!user) return { error: "UserNotFound" };

        const currentAccess =
            user.UserAttributes?.find((_) => _.Name === ACCESS_GROUP_ATTR)?.Value ?? "none";

        const groupsForUserCommand = new AdminListGroupsForUserCommand(common);
        const groups = (await client.send(groupsForUserCommand)).Groups;
        const groupNames = groups?.map((group) => group.GroupName ?? "") ?? [];

        const parsedUser = attributeListToUser(event.username, user.UserAttributes);

        if (event.permissions === currentAccess)
            return {
                error: "None",
                data: parsedUser
            };

        // users should belong to a single group at a time
        // but making sure that we can handle if that's not the case
        // isn't particularly egregious
        for (const group of groupNames) {
            const removeCommand = new AdminRemoveUserFromGroupCommand({
                ...common,
                GroupName: group
            });
            await client.send(removeCommand);
        }

        if (event.permissions === "none") {
            const disableCommand = new AdminDisableUserCommand(common);
            await client.send(disableCommand);
        } else {
            const lookup = await getGroups(event.userPoolId, client);
            const target = lookup[event.permissions];
            const attrib = [{ Name: ACCESS_GROUP_ATTR, Value: target }];

            const updateAttributesCommand = new AdminUpdateUserAttributesCommand({
                ...common,
                UserAttributes: attrib
            });
            await client.send(updateAttributesCommand);

            const addToGroupCommand = new AdminAddUserToGroupCommand({
                ...common,
                GroupName: target
            });
            await client.send(addToGroupCommand);

            if (!user.Enabled) {
                const enableUserCommand = new AdminEnableUserCommand(common);
                await client.send(enableUserCommand);
            }
        }

        return { error: "None", data: { ...parsedUser, permissions: event.permissions as any } };
    } catch (err) {
        return { error: (err as Error)?.name ?? "UnknownError" };
    }
}
