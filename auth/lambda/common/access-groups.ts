export enum AccessGroupKeys {
    Petitioner = "petitioner",
    CityStaff = "city_staff",
    CityStaffGuest = "staff_guest",
    Admin = "admin"
}

export const ACCESS_GROUP_ATTR = "custom:access_group";
export type GroupNameLookup = { [K in AccessGroupKeys]?: string };
