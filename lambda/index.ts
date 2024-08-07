import { APIGatewayProxyHandler } from 'aws-lambda';
import OpenAI from "openai";
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });

export const handler: APIGatewayProxyHandler = async (event: any) => {
  try {
    console.log('event', event, typeof event);
    let skills = await analyzeJobDescription(event.body);
    console.log('skills', skills);
    const response = {
      statusCode: 200,
      body: JSON.stringify(skills),
    };
    console.log('response', response);

    if (skills?.length) await storeResultInDynamoDB(event.body, skills);

    return response;
  } catch (error) {
    console.log('error', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `An error occurred + ${error}` }),
    };
  }
};

async function analyzeJobDescription(description: string) {
  const prompt = `
  Analyze the following job description and extract the skills required,
  categorize their importance (High, Medium, Low), and proficiency 
  (Advanced, Intermediate, Novice). Provide the response as a JSON array of objects.
  ${description}
  `;
  try {
    console.log('prompt', prompt);
    const result = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o-mini',
    }, {timeout: 25 * 1000});

    return result.choices;
  } catch (error) {
    throw new Error('Failed to analyze job description');
  }
}


async function storeResultInDynamoDB(description: string, skills: any[]) {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME || 'JobDescriptions',
    Item: {
      id: { S: Date.now().toString() },
      description: { S: description },
      skills: { S: JSON.stringify(skills) },
    },
  };

  const command = new PutItemCommand(params);
  try {
    await dynamoDbClient.send(command);
    console.log("Data stored successfully");
  } catch (error) {
    console.error("Error storing data in DynamoDB", error);
  }

}
