import packageTask from './package';
import deployTask from './deploy';
import { TaskArgs } from "../types";


export default async (params: TaskArgs): Promise<any> => {
    const packageResults = await packageTask(params);
    const deployResults = await deployTask(params);
};
