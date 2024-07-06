const Responses = require('../common/API_Responses')

exports.handler = async (event) => {
    console.log("event params "+ event.pathParameters);
    if(!event.pathParameters || !event.pathParameters.ID){
        //failed without ID
        return Responses._400({message: 'ID not found'})
    }

    let ID = event.pathParameters.ID;

    if (data[ID]){
        // return the data
        return Responses._200(data[ID]);
    }

    // failed as ID not in data
    return Responses._400({message: 'ID not match'})
}


const data = {
    123: { name: 'javid', age: 25},
    456: { name: 'paul', age: 18},
    789: { name: 'jorden', age: 100}
}