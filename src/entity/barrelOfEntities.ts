/*
 * This module is created to avoid
 * a circular dependency in TypeORM
 * entities bidirectional relations.

import { Event } from './Event';
import { Team } from './Team';

export let event: Event = new Event();
export let team: Team = new Team();
* */

export * from './Event.js';
export * from './Team.js';
