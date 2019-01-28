import { exec } from 'child_process';
import { join, resolve } from 'path';
import { TaskArgs } from "../types";


export default async (params: TaskArgs): Promise<any> => {
    return new Promise((promResolve, promReject) => {
        const tmplFile = join('.', 'template.yaml');
        const outputFile = join('.', 'build', 'audio-recorder.yaml');
        const bucketName = 'sosnowski-deployments';

        console.log(`Creating application package: ${tmplFile} -> ${outputFile}, s3: ${bucketName}`);
        const childProc = exec(
            `sam package --template-file ${tmplFile} --output-template-file ${outputFile} --s3-bucket ${bucketName}`,
            {
                cwd: resolve(__dirname, '..', '..'),
            },
            (err, stdout: string, stderr: string) => {
                if (err) {
                    promReject(err);
                }
                promResolve();
        });

        childProc.stdout.on('data', (msg) => {
            console.log(msg);
        });
    });
};
