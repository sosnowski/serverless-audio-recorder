
import { S3 } from 'aws-sdk';
import { Request } from '@shared';
import { promisify } from 'util'
import { DateTime } from 'luxon';

// https://sanderknape.com/2017/08/using-pre-signed-urls-upload-file-private-s3-bucket/


const { DB_TABLE, CURRENT_USER_ID, AUDIO_FILES_BUCKET } = process.env;

const s3 = new S3({
    signatureVersion: 'v4',
});

const getSignedUrl = promisify<string, any, string>(s3.getSignedUrl.bind(s3));

export const lambdaHandler = async (event: any = {}, context: any) => {
    const date = DateTime.local();
    const title = `Recording - ${date.toLocaleString(DateTime.DATETIME_MED)}`;
    const itemKey = `user-${CURRENT_USER_ID}-${date.toISO()}`;
    const extension = 'ogg';
    try {
        console.log(`BUCKET NAME: ${AUDIO_FILES_BUCKET}`);
        const url = await getSignedUrl('putObject', {
            Bucket: AUDIO_FILES_BUCKET,
            Key: `${itemKey}.${extension}`,
            ContentType: 'audio/ogg; codecs=opus',
            Metadata: {
                title: title,
                user: CURRENT_USER_ID
            }
        });
        return Request.ok(url);
    } catch (err) {
        console.log(err);
        return Request.error(err);
    }
};
