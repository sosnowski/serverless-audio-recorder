
import { Db, Request } from '@shared';

const { DB_TABLE, CURRENT_USER_ID } = process.env;

export const lambdaHandler = async (event: any, context: any) => {
    try {
        const results = await Db.loadRecordingsByUser(CURRENT_USER_ID!);
        return Request.ok(results);
    } catch (err) {
        console.log(err);
        return Request.error(err);
    }
};
