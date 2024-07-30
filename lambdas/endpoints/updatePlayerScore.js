const Responses = require('../common/API_Responses')
const DynamoDB = require('../common/Dynamo')
const TableName = 'player-points';
const { withHooks, withHooksValidation } = require('../common/Hooks.js')
const yup = require('yup')

const pathSchema = yup.object().shape({
    ID: yup.string().required(),
});

const bodySchema = yup.object().shape({
    score: yup.number().required(),
});

const handler = async (event) => {
    let ID = event.pathParameters.ID;
    const { score } = event.body;

    console.log(`log key ${ID} from table ${TableName}`);

    const user = await DynamoDB.update({
        tableName: TableName,
        primaryKey: 'ID',
        primaryKeyValue: ID,
        updateKey: 'score',
        updateValue: score
    });

    if (!user) {
        return Responses._400({message: 'Failed to get user ID'})
    }

    return Responses._200(user.score)
};

exports.handler = withHooksValidation({bodySchema, pathSchema})(handler);