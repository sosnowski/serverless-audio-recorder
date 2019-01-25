
import { S3 } from 'aws-sdk';
import { promisify } from 'util';
import { Db, Request } from '@shared';
import { DateTime } from 'luxon';

const { DB_TABLE, CURRENT_USER_ID } = process.env;

const s3 = new S3();

const getSignedUrl = promisify<string, any, string>(s3.getSignedUrl.bind(s3));

export const lambdaHandler = async (event: any = {}, context: any) => {
    const date = DateTime.local();
    const title = `Recording - ${date.toLocaleString(DateTime.DATETIME_MED)}`;
    const itemKey = `audio-files/User ${CURRENT_USER_ID} - ${date.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)}`;
    const extension = 'ogg';
    try {
        const params = event.queryStringParameters || {};
        const url = await getSignedUrl('putObject', {
            Bucket: 'audio-recorder-recordings-bucket',
            Key: `${itemKey}.${extension}`,
            ContentType: 'audio/ogg',
            Metadata: {
                title: title,
                user: CURRENT_USER_ID
            }
        });
        console.log(`url: ${url}`);
        return Request.ok(url);
    } catch (err) {
        console.log(err);
        return Request.error(err);
    }
};
