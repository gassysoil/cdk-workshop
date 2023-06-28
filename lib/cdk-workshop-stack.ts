import { App, Stack, StackProps } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import { HitCounter } from "./hitcounter";

export class CdkWorkshopStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const hello = new lambda.Function(this, "HelloHandler", {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset("lambda"), // code loaded from "lambda" directory
      handler: "hello.handler", // file is "hello", function is "handler"
    });

    // refer to its constructor(scope: Construct, id: string, props: HitCounterProps)
    const helloWithCounter = new HitCounter(this, "HelloHitCounter", {
      downstream: hello, //this is the HitCounterProps
    });

    // defines an API Gateway REST API resource backed by our "hello" function.
    new apigw.LambdaRestApi(this, "Endpoint", {
      handler: helloWithCounter.handler,
    });
  }
}

// Test in terminal and check dynamoDB to confirm
// curl https://zjmzxbwqid.execute-api.us-west-2.amazonaws.com/prod/
// Hello, CDK! You've hit /
// curl https://zjmzxbwqid.execute-api.us-west-2.amazonaws.com/prod/hello
// Hello, CDK! You've hit /hello
// curl https://zjmzxbwqid.execute-api.us-west-2.amazonaws.com/prod/hello/world
// Hello, CDK! You've hit /hello/world
