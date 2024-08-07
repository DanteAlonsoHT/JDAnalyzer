import { APIGatewayProxyHandler } from 'aws-lambda';
import { analyzeJobDescription } from './src/analyzer/openaiAnalyzer';
import { storeResultInDynamoDB } from './src/database/dynamoDbService';
import { Skill } from './src/types';
import { cleanJsonString } from './src/utils/jsonUtils';
import { createResponse } from './src/utils/responseUtils';
import { STATUS_CODES, ERROR_MESSAGES } from './src/constants/constants';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    if (!event.body) {
      return createResponse(STATUS_CODES.BAD_REQUEST, { error: ERROR_MESSAGES.NO_BODY });
    }

    const cleanedBody = cleanJsonString(event.body);
    const { JobDescription } = JSON.parse(cleanedBody);

    if (!JobDescription) {
      return createResponse(STATUS_CODES.BAD_REQUEST, { error: ERROR_MESSAGES.MISSING_JOB_DESCRIPTION });
    }

    const skills: Skill[] = await analyzeJobDescription(JobDescription);
    if (skills.length > 0) await storeResultInDynamoDB(JobDescription, skills);

    return createResponse(STATUS_CODES.OK, skills);
  } catch (error) {
    console.error('Handler error:', error);
    return createResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, { error: ERROR_MESSAGES.INTERNAL_ERROR });
  }
};
