import { ParsedArgs } from 'minimist';
export interface TaskArgs extends ParsedArgs {}

export type Task = (args: TaskArgs) => Promise<any>;
