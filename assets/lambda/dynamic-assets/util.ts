import { DYNAMIC_ASSET_PATH_PREFIX, prefixMapping, ResourceType } from "./types";

export function extractDate(n: string): number {
    return parseInt(n.split(".")[1]);
}

export const ONE_HOUR: number = 60 * 60;

export function oneHourFromNow(): Date {
    return new Date(new Date().getTime() + ONE_HOUR);
}

export function getResourcePrefix(forItem: ResourceType): string {
    return `${DYNAMIC_ASSET_PATH_PREFIX}/${prefixMapping[forItem]}`;
}

export function getNewResourceTargetFile(forItem: ResourceType): string {
    return `${getResourcePrefix(forItem)}/${prefixMapping[forItem]}.${new Date().getTime()}`;
}
