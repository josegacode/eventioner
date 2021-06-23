/**
 * @params reaction The reaction object triggered in some server
 *
 * This method handles the team build
 * for the events by cheking the number
 * of reactions (members who want to be part
 * of some team) and creating or not they
 * text and voice channels.
 * */
export function handleTeamBuild(reaction: any): Promise<boolean>;
