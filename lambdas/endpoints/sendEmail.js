const Responses = require('../common/API_Responses');
const AWS = required('aws-sdk');

const SES = new AWS.SES();


exports.handler = async (event) => {
    console.log("event params "+ event.pathParameters);
    const { to, from, subject, text} = JSON.parse(event.body);

    if (!to || !from || !subject || !text ) {
        return Responses._400({message: "all required from body"})
    }

    const params = {
        Destination: {
            ToAddresses: { to }
        },
        Message: {
            Body: {
                Text: { Data: text }
            },
            Subject: { Data: subject }
        },
        Source: from
    };

    try {
        await SES.sendEmail(params).promise()
        return Responses._200({});
    } catch (error) {
        console.log('error sending email', error);
        return Responses._400({message: 'email failed to send'});
    }
}