import minimist from 'minimist';
import { exec } from 'child_process';
import { promisify } from 'util';
import { TaskArgs, Task } from './types';

const execPromise = promisify(exec);
const args = minimist(process.argv.slice(2));

const taskName = args._[0];

if (!taskName) {
    throw new Error('Missing task name to run');
}

const runTask = async (taskName: string, params: TaskArgs) => {
    try {
        console.log(`\nLoading task ${taskName}...`);
        const task: Task = (await import(`./tasks/${taskName}`)).default;
        if (!task) {
            throw new Error(`Not able to load task: ${taskName}`);
        }
        console.log(`\nStarting task execution...`);
        const taskResults = await task(params);

        console.log('\nDone.');
    } catch (e) {
        console.log('Task error');
        console.error(e);
    }
}

runTask(taskName, args);
