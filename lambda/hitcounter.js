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
  // add an attribute "hits" with variable name "incr", the variable "incr" has value of 1
  // ADD - Adds the specified value to the item, if the attribute does not already exist.
  // If the attribute does exist, then the behavior of ADD depends on the data type of the attribute:
  // If the existing attribute is a number, and if Value is also a number, then Value is mathematically added to the existing attribute.
  // If Value is a negative number, then it is subtracted from the existing attribute.

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
