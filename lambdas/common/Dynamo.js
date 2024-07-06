const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();


const Dynamo = {
    async get(ID, TableName) {
        console.log(`Dynamo key ${ID} from table ${TableName}`);
        const params = {
            TableName,
            Key: {
                ID: ID
            }
        };

        const data = await documentClient
            .get(params)
            .promise()

        if (!data || !data.Item) {
            throw Error(`error fetching the data for ID of ${ID} fron ${TableName}`)
        }

        console.log(data);

        return data.Item;
    },

    async set(data, TableName) {
        const params = {
            TableName,
            Item: data
        };
        
        console.log('Params:', JSON.stringify(params, null, 2));

        const userData = await documentClient
            .put(params)
            .promise()

        if (!userData || !userData.Item) {
            throw Error(`error fetching the data for ID of ${ID} fron ${TableName}`)
        }

        console.log(userData);

        return userData.Item;
    }
}

module.exports = Dynamo;