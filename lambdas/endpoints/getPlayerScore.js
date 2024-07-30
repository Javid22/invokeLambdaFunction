const Responses = require('../common/API_Responses')
const DynamoDB = require('../common/Dynamo')
const TableName = process.env.tableName
const { withHooks, withHooksPathValidation } = require('../common/Hooks.js')
const yup = require('yup')

const pathSchema = yup.object().shape({
    ID: yup.string().required(),
});




const handler = async (event) => {
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

    if (!user) {
        return Responses._400({message: 'Failed to get user ID'})
    }

    return Responses._200(user.score)
};

exports.handler = withHooksPathValidation({pathSchema})(handler);