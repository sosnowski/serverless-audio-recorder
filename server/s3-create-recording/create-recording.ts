import { inspect } from 'util';
import { S3, DynamoDB } from 'aws-sdk';
import { Models } from '@shared';

const { DB_TABLE, CURRENT_USER_ID } = process.env;

const s3 = new S3();
const db = new DynamoDB.DocumentClient();


export const lambdaHandler = async (event: any, context: any) => {
    console.log("Reading options from event:\n", inspect(event, {depth: 5}));
    try {
        const srcBucket = event.Records[0].s3.bucket.name;
        const srcKey = event.Records[0].s3.object.key;

        const objectInfo = await s3.headObject({
            Bucket: srcBucket,
            Key: srcKey
        }).promise();

        console.log('Object info')
        console.log(objectInfo);

        const metadata = objectInfo.Metadata || {};

        if (!metadata.user || !metadata.title) {
            throw new Error('Missing title or user metadata in the file!');
        }

        console.log('\nChecking if the record exists\n');

        const existingRecord = await db.get({
            TableName: DB_TABLE!,
            Key: {
                userId: metadata.user,
                recordId: srcKey
            }
        }).promise();

        if (existingRecord && existingRecord.Item) {
            throw new Error('Record for the given file already exists');
        }

        const record: Models.Recording = {
            recordId: srcKey,
            userId: metadata.user,
            title: metadata.title,
            created: (new Date()).toISOString(),
            updated: (new Date()).toISOString()
        };
        console.log('\nSaving data\n');
        console.log(record);
        const queryResult: DynamoDB.DocumentClient.PutItemOutput = await db.put({
            TableName: DB_TABLE!,
            Item: record
        }).promise();

        console.log('\nsaved\n');

        console.log(queryResult);
    } catch (err) {
        console.error(err);
    }
};
