const { json } = require('express/lib/response');
const { useHooks, logEvent, parseEvent, handleUnexpectedError } = require('lambda-hooks');

// Basic hook setup
const withHooks = useHooks({
    before: [logEvent, parseEvent],
    after: [],
    onError: [handleUnexpectedError],
});

// Validation hooks with body and path schemas
const withHooksValidation = ({bodySchema, pathSchema}) => useHooks(
    {
        before: [logEvent, parseEvent, validateBodySchema, validateUrlSchema],
        after: [],
        onError: [handleUnexpectedError],
    },
    {
        bodySchema,
        pathSchema
    }
);

// Validation hooks with only path schema
const withHooksPathValidation = ({pathSchema}) => useHooks(
    {
        before: [logEvent, parseEvent, validateUrlSchema],
        after: [],
        onError: [handleUnexpectedError],
    },
    {
        pathSchema
    }
);

module.exports = {
    withHooks,
    withHooksValidation,
    withHooksPathValidation
};

// Function to validate the body schema
const validateBodySchema = async state => {
    const {bodySchema} = state.config;

    if (!bodySchema) {
        throw new Error('Missing the required body schema');
    }

    try {
        const { event } = state;
        await bodySchema.validate(event.body, {strict: true});
    } catch (error) {
        console.log('Yup validation error of event.body', error);
        state.exit = true;
        state.response = {
            statusCode: 400,
            body: JSON.stringify({error: error.message})
        };
    }

    return state;
}

// Function to validate the URL schema
const validateUrlSchema = async state => {
    const {pathSchema} = state.config;

    if (!pathSchema) {
        throw new Error('Missing the required path schema');
    }

    try {
        const { event } = state;
        await pathSchema.validate(event.pathParameters, {strict: true});
    } catch (error) {
        console.log('Yup validation error of event.pathParameters', error);
        state.exit = true;
        state.response = {
            statusCode: 400,
            body: JSON.stringify({error: error.message})
        };
    }

    return state;
}
