const { Lambda, DynamoDB } = require("aws-sdk");

exports.handler = async function (event) {
  console.log("request:", JSON.stringify(event, undefined, 2));

  const dynamodb = new DynamoDB();
  const lambda = new Lambda();

  // update dynamo entry for "path" with hits++
  await dynamodb
    .updateItem({
      TableName: process.env.HITS_TABLE_NAME,
      Key: { path: { S: event.path } },
      UpdateExpression: "ADD hits :incr",
      ExpressionAttributeValues: { ":incr": { N: "1" } },
    })
    .promise();

  //add an attribute "hits" with variable name "incr", the variable "incr" has value of 1

  // call downstream function and capture response
  const resp = await lambda
    .invoke({
      FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME,
      Payload: JSON.stringify(event),
    })
    .promise();

  console.log("downstream response:", JSON.stringify(resp, undefined, 2));

  // return response back to upstream caller
  return JSON.parse(resp.Payload);
};

//DynamoDB API
//https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html#:~:text=Required%3A%20No-,UpdateExpression,-An%20expression%20that
