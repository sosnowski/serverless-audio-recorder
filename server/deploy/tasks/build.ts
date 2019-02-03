import { exec } from 'child_process';
import { join, resolve } from 'path';
import { readFile } from 'fs';
import { promisify } from 'util';
import { schema } from 'yaml-cfn';
import { safeLoad } from 'js-yaml';
import { TaskArgs } from "../types";

const read = promisify(readFile);

interface LambdaInfo {
    name: string;
    path: string;
}

const getLambdaPaths = async (templatePath: string): Promise<LambdaInfo[]> => {
    const templateContent = await read(templatePath, 'utf8');
    const doc = safeLoad(templateContent, { schema: schema });

    const lambdas = Object.keys(doc.Resources).filter((key) => {
        const resource = doc.Resources[key];
        return resource.Type === 'AWS::Serverless::Function' && resource.Properties.CodeUri;
    }).map((key) => {
        const resource = doc.Resources[key];
        return {
            name: key,
            path: resource.Properties.CodeUri
        };
    });
    return lambdas;
}


export default async (params: TaskArgs): Promise<any> => {

    return new Promise(async (promResolve, promReject) => {
        try {
            const templatePath = join(__dirname, '..', '..', 'template.yaml');
            console.log(`\nReading project template: ${templatePath}`);
            const lambdas = await getLambdaPaths(templatePath);
            console.log(`\nRunning build for lambdas:`);
            lambdas.forEach((lambda) => {
                console.log(`\t${lambda.name} : ${lambda.path}`);
            });


            const lambdaPaths = lambdas.map(lambda => lambda.path).join(' ');
            const childProc = exec(
                `tsc --build ${params.watch ? '--watch' : '--force'} ${lambdaPaths}`,
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
        } catch (e) {
            promReject(e);
        }
    });
};
