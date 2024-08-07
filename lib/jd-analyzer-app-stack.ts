import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as path from 'path';

export class JobDescriptionAnalyzerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a DynamoDB table
    const table = new dynamodb.Table(this, 'JobDescriptions', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    });

    // Define the Lambda function
    const jobDescriptionLambda = new lambda.Function(this, 'JobDescriptionHandler', {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      handler: 'index.handler',
      environment: {
        DYNAMODB_TABLE_NAME: table.tableName,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
      },
      tracing: lambda.Tracing.ACTIVE,
      timeout: cdk.Duration.seconds(15),
    });

    // Grant Lambda function access to the DynamoDB table
    table.grantReadWriteData(jobDescriptionLambda);

    const api = new apigateway.LambdaRestApi(this, 'JobDescriptionApi', {
      handler: jobDescriptionLambda,
      proxy: false,
      restApiName: 'JobDescriptionAnalyzerAPI',
      deployOptions: {
        stageName: 'dev',
      },
    });

    const resource = api.root.addResource('analyze');
    resource.addMethod('POST');

  }
}
