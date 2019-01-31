import { Request, Models } from '@shared';
import { DynamoDB, AWSError } from 'aws-sdk';

const {
    DB_TABLE,
    CURRENT_USER_ID
} = process.env;

let db: DynamoDB.DocumentClient;

const getDb = () => {
    if (!db) {
        db = new DynamoDB.DocumentClient({});
    }
    return db;
}

export const lambdaHandler = async (event: any, context: any) => {
    try {
        const res = await getDb().query({
            TableName: DB_TABLE!,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': CURRENT_USER_ID
            }
        }).promise();

        return Request.ok(res.Items || []);
    } catch (err) {
        console.log(err);
        return Request.error(err);
    }
};
