import { Entity, Column, PrimaryColumn, ManyToOne } from "typeorm";
import { Event } from './Event.js';

@Entity()
export class Team {
    @PrimaryColumn()
    team_id: number;

    @Column("text")
    name: string;

    @Column("text")
    lead_discord_id: string;

		@ManyToOne(() => Event, event => event.teams)
		event: Event;
}
