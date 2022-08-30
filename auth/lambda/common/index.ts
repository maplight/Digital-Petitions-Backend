import {
    CognitoIdentityProviderClient,
    ListGroupsCommand
} from "@aws-sdk/client-cognito-identity-provider";
import { AccessGroupKeys, GroupNameLookup } from "./access-groups";

export * from "./access-groups";

export const getGroups = async (
    userPool: string,
    client: CognitoIdentityProviderClient
): Promise<GroupNameLookup> =>
    (await client.send(new ListGroupsCommand({ UserPoolId: userPool }))).Groups?.map(
        (_) => _.GroupName ?? "Unknown"
    )?.reduce((dict, group) => {
        if (group.indexOf("Petitioner") >= 0) {
            dict[AccessGroupKeys.Petitioner] = group;
        } else if (group.indexOf("Guest") >= 0) {
            dict[AccessGroupKeys.CityStaffGuest] = group;
        } else if (group.indexOf("CityStaff") >= 0) {
            dict[AccessGroupKeys.CityStaff] = group;
        } else if (group.indexOf("Admin") >= 0) {
            dict[AccessGroupKeys.Admin] = group;
        }

        return dict;
    }, {} as GroupNameLookup) ?? {};
