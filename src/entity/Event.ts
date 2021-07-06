import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Team } from "./Team";

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    event_id: number;

    @Column("text")
    verticals: string;

    @Column("text")
    type_of_mentors: string;

    @Column("text")
    members_per_team: string;

    @Column()
    is_active: boolean;

		@OneToMany(() => Team, team => team.event)
		teams: Team[];
}
