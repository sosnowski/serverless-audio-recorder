import { exec } from 'child_process';
import { join, resolve } from 'path';
import { TaskArgs } from "../types";


export default async (params: TaskArgs): Promise<any> => {
    return new Promise((promResolve, promReject) => {
        const tmplFile = join('.', 'build', 'audio-recorder.yaml');
        const stackName = 'audio-rec-dev';

        console.log(`Deploying application: ${tmplFile} to ${stackName}`);
        const childProc = exec(
            `sam deploy --template-file ${tmplFile} --stack-name ${stackName} --capabilities CAPABILITY_IAM`,
            {
                cwd: resolve(__dirname, '..', '..'),
            },
            (err, stdout: string, stderr: string) => {
                if (err) {
                    promReject(err);
                    return;
                }
                if (stderr.length > 0) {
                    promReject(stderr);
                    return;
                }
                promResolve();
        });

        childProc.stdout.on('data', (msg) => {
            console.log(msg);
        });

        childProc.stderr.on('data', (err) => {
            console.log(err);
        });

    });
};
