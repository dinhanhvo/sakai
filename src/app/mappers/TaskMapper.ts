import {Task, TaskRequest} from "../model/task";

export class TaskMapper {
    /**
     * Map Task -> TaskRequest
     * @param task - source
     * @returns TaskRequest
     */
    static toRequest(task: Task): TaskRequest {
        return {
            id: task.id,
            // project: task.project ? parseInt(task.project) : undefined,
            title: task.title,
            description: task.description,
            status: task.status,
            // assignedTo: task.assignedTo ? parseInt(task.assignedTo) : undefined,
        };
    }

    /**
     * Map TaskRequest -> Task
     * @param request - source TaskRequest
     * @returns Task
     */
    static toTask(request: TaskRequest): Task {
        return {
            id: request.id,
            // project: request.project?.toString(),
            title: request.title,
            description: request.description,
            status: request.status,
            // assignedTo: request.assignedTo?.toString(),
            createdAt: undefined,
            updatedAt: undefined,
        };
    }
}
