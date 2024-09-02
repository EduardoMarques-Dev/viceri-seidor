export class Task {
  constructor(
    public id?: Number | null,
    public description?: string,
    public priority?: string,
    public status?: string
  ) {}
}
