import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { Skill } from '../types';
import * as dotenv from 'dotenv';

dotenv.config();

const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });

export async function storeResultInDynamoDB(description: string, skills: Skill[]) {
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
    console.error("Error storing data in DynamoDB:", error);
    throw new Error('Failed to store data in DynamoDB');
  }
}
