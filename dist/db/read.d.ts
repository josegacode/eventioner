export function checkIfServerExists(serverId: any): Promise<any>;
export function checkIfServerIsLinkedWithBot(botId: any, serverId: any): Promise<any>;
export function checkIfThereAreActiveEvents(serverId: any): Promise<any>;
/**
 * @param eventId Eventbrite event id
 * @returns Promise<boolean>
 *
 * Checks if the event
 * is active by using its
 * eventbrite id, no matters
 * which server is linked to
 * it.
 * */
export function checkIfEventIsActive(params: any): Promise<any>;
/**
 * @param a server id linked to event that we want
 * to retrieve
 * @returns Promise<boolean>
 *
 * Checks if the event
 * is active by using its
 * eventbrite id, no matters
 * which server is linked to
 * it.
 * */
export function getEventActiveInfo(serverId: any): Promise<[import("mysql2/typings/mysql/lib/protocol/packets/OkPacket") | import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader") | import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket")[] | import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket")[][] | import("mysql2/typings/mysql/lib/protocol/packets/OkPacket")[], import("mysql2/typings/mysql/lib/protocol/packets/FieldPacket")[]]>;
/**
 * TODO: replace by getEventActiveInfo
 * @param a server id linked to event that we want
 * to retrieve
 * @returns Promise<boolean>
 *
 * Checks if the event
 * is active by using its
 * eventbrite id, no matters
 * which server is linked to
 * it.
 * */
export function getVerticals(params: any): Promise<any>;
/**
 * TODO: replace by getEventActiveInfo
 * @param a server id linked to event that we want
 * to retrieve
 * @returns Promise<boolean>
 *
 * Checks if the event
 * is active by using its
 * eventbrite id, no matters
 * which server is linked to
 * it.
 * */
export function getMembersPerTeam(params: any): Promise<any>;
/**
 * @param a server id linked to event that we want
 * to retrieve
 * @returns Promise<boolean>
 *
 * Checks if the event
 * is active by using its
 * eventbrite id, no matters
 * which server is linked to
 * it.
 * */
export function getTeams(eventId: any): Promise<any>;
