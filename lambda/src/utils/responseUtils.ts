/**
 * Creates a response object for AWS Lambda.
 *
 * @param statusCode - HTTP status code of the response.
 * @param body - The body of the response, which will be JSON stringified.
 * @returns A response object formatted for AWS Lambda.
 */
export function createResponse(statusCode: number, body: object) {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
}
