// mapperUtil.ts

import {User} from "../model/user";
import {Project} from "../model/project";

/**
 * map User to { label, value }
 * @param users
 * @returns a list
 */
export function mapUsersToLabelValue(users: User[]): { label: string; value: number | null }[] {
    return users.map(user => ({
        label: user.name || 'Unknown',
        value: user.id ?? null
    }));
}

export function mapProjectsToLabelValue(projects: Project[]): { label: string; value: number | null }[] {
    return projects.map(project => ({
        label: project.name || 'Unknown',
        value: project.id ?? null
    }));
}
