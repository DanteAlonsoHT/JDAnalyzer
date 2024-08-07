# Job Description Analyzer API

## Summary

The Job Description Analyzer API processes job descriptions to extract and categorize skills using OpenAI's GPT-4o-mini and stores the results in DynamoDB. The API is designed with high cohesion and low coupling principles, making it modular and maintainable.

## Prompts Used

- "How to set up a Lambda function locally with CDK and make changes to production"
- "How to handle OpenAI API responses with Typescript"
- "How to store data in DynamoDB using AWS SDK?"
- "Recommedations for high cohesion and low coupling in the next code"
- "Clean JSON strings for any problematic character when parsing?"
- "Purpose way to organize TypeScript project for readability and maintainability."

## Steps to Run the Project

1. **Clone the Repository**: 
   - `git clone <repository-url>`
2. **Install Dependencies**: 
   - `npm install`
3. **Configure Environment**:
   - Create a `.env` file with your OpenAI API key.
   - Example: `OPENAI_API_KEY=your_openai_api_key`
   - For deployment purposes, you can set up the ENV variables in the Lambda side.
4. **Deploy the Stack**:
   - For deployment purposes, run `tsc` to generate the Typescript files.
   - Run `cdk deploy` to deploy the infrastructure.
6. **Test the API**:
   - Use Postman to send a POST request to the API created endpoint.

```bash
ENDPOINT: <YOUR_ENDPOINT>/analyze
HEADER: 'Content-Type': 'application/json'
BODY: JSON {
  "JobDescription": "Software Engineer 1 \n\n# Software Engineer \n\n We're hiring a software engineer at Noxx. \n\n## Company Overview \n\n We believe everybody should be evaluated based on merit for job opportunities...
}
```

## Doubts abd Ambiguous Parts

- **Cleaning JSON**: Uncertainty about the specific problematic characters to be removed or escaped in JSON strings.
- **Skill Categorization**: Defining exact criteria for determining the importance and proficiency levels from job descriptions, maybe adding more relevant prompts to categorize better.
- **OpenAI Model Selection**: Choosing the right model for accuracy and performance balance.

## Likely Next Steps

1. **Enhance Error Handling**: Improve logging and error messages for better debugging and monitoring.
2. **Expand Skill Extraction**: Incorporate more sophisticated logic for extracting and understanding job requirements.
3. **Add Unit Tests**: Implement unit and integration tests to ensure code functionality.
4. **Optimize Performance**: Explore thread safety optimizations to reduce response times in AWS servers when multiple requests.
5. **Deploy on CI/CD Pipeline**: Automate the deployment process using CI/CD tools for continuous integration and deployment.
