import { inspect, promisify } from 'util';
import { Request, Models } from '@shared';
import { DynamoDB, S3 } from 'aws-sdk';

const {
    DB_TABLE,
    CURRENT_USER_ID,
    AUDIO_FILES_BUCKET
} = process.env;

let db: DynamoDB.DocumentClient;

const getDb = () => {
    if (!db) {
        db = new DynamoDB.DocumentClient({});
    }
    return db;
}

const s3 = new S3({
    signatureVersion: 'v4',
});

const getSignedUrl = promisify<string, any, string>(s3.getSignedUrl.bind(s3));

export const lambdaHandler = async (event: any, context: any) => {
    try {

        const recordId = decodeURIComponent(event.pathParameters.recordId);
        console.log(`Requested record ID: ${recordId}`);
        if (!recordId) {
            throw new Error('Missing recordId parameter');
        }
        console.log('Reading DB for a record');
        const res = await getDb().get({
            TableName: DB_TABLE!,
            Key: {
                userId: CURRENT_USER_ID,
                recordId: recordId
            }
        }).promise();

        console.log('Record loaded');

        if (!res.Item) {
            throw new Error(`Record: ${recordId} for user ${CURRENT_USER_ID} not found`);
        }

        const url = await getSignedUrl('getObject', {
            Bucket: AUDIO_FILES_BUCKET,
            Key: recordId,
            Expires: 60 * 60 * 2 //2h
        });

        return Request.ok({
            ...res.Item,
            audioUrl: url
        });
    } catch (err) {
        console.log(err);
        return Request.error(err);
    }
};
