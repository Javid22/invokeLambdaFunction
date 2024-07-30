const Responses = require('../common/API_Responses')
const DynamoDB = require('../common/Dynamo')
const TableName = process.env.tableName

exports.handler = async (event) => {
        console.log("event params "+ event.pathParameters);
        if(!event.pathParameters || !event.pathParameters.batsman) {
            return Responses._400({message: 'Missing game params'})
        }

        let batsman = event.pathParameters.batsman;
        let batsmanData = batsman.charAt(0).toUpperCase() + batsman.slice(1);
        console.log(` from table ${batsmanData}`);
        const user = await DynamoDB.query({
            tableName: TableName,
            index: 'batsman-index',
            queryKey: 'batsman',
            queryValue: batsmanData,
        });

        return Responses._200(user);
    

    return Responses._400({message: `something went wrong`});
}