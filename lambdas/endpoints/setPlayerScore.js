const Responses = require('../common/API_Responses')
const DynamoDB = require('../common/Dynamo')
const TableName = process.env.tableName

exports.handler = async (event) => {
    console.log("event params "+ event.pathParameters);
    if(!event.pathParameters || !event.pathParameters.ID){
        //failed without ID
        return Responses._400({message: 'ID not found'})
    }

    let ID = event.pathParameters.ID;
    console.log(`log key ${ID} from table ${TableName}`);
    const user = await DynamoDB.get(ID, TableName).catch(err => {
        console.log("error in Dynamo Get", err);
        return null;
    })

    const { age, name, score } = JSON.parse(event.body);

    const params = {
          ID: ID,
          age: age,
          name: name,
          score: score
      };
    console.log(`set first params ${params}`);
    
    if (!user) {
        const addUser = await DynamoDB.set(params, TableName).catch(err => {
            console.log("error in Dynamo Get", err);
            return null;
        })

        return Responses._200({message: `user data has been successfully created`})
    }

    return Responses._400({message: `something went wrong`});
}