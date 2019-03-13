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
        console.log(`\nUpdated record ID: ${recordId}`);
        if (!recordId) {
            throw new Error('Missing recordId parameter');
        }
        console.log('\nEvent body\n');
        console.log(event.body);
        const newRecordData: Partial<Models.Recording> = JSON.parse(event.body);
        console.log('\n');
        console.log(newRecordData);
        if (!newRecordData.title) {
            throw new Error('Missing new record title!');
        }
        console.log('\nReading DB for a record');
        const currentRecord = await getDb().get({
            TableName: DB_TABLE!,
            Key: {
                userId: CURRENT_USER_ID,
                recordId: recordId
            }
        }).promise();

        if (!currentRecord.Item) {
            throw new Error(`Record: ${recordId} for user ${CURRENT_USER_ID} not found`);
        }

        const newRecord = Object.assign({}, currentRecord.Item , {
            title: newRecordData.title
        });

        console.log(`\nSave new record`);

        const result = await getDb().put({
            TableName: DB_TABLE!,
            Item: newRecord
        }).promise();

        console.log(`\nGet new urls`);

        const getAudioUrlPromise = getSignedUrl('getObject', {
            Bucket: AUDIO_FILES_BUCKET,
            Key: recordId,
            Expires: 60 * 60 * 2 //2h
        });

        const deleteAudioUrlPromise = getSignedUrl('deleteObject', {
            Bucket: AUDIO_FILES_BUCKET,
            Key: recordId,
            Expires: 60 * 60 * 2 //2h
        });

        return Request.ok({
            ...newRecord,
            getAudioUrl: await getAudioUrlPromise,
            deleteAudioUrl: await deleteAudioUrlPromise
        });
    } catch (err) {
        console.log(err);
        return Request.error(err);
    }
};
