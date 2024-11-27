
export function findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
}
