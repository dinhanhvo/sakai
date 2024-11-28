export interface Task {
    id?: number;
    project?: string;
    title?: string;
    description?: string;
    status?: string;
    assignedTo?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TaskRequest {
    id?: number;
    project?: number;
    title?: string;
    description?: string;
    status?: string;
    assignedTo?: number;
}

