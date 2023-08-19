import { CognitoUserPool } from "amazon-cognito-identity-js";
import { POOL_ID } from "@env";
import { CLIENT_ID } from "@env";

// Define the poolData object containing User Pool configuration details.
const poolData = {
  UserPoolId: POOL_ID,      // The ID of the Amazon Cognito User Pool
  ClientId: CLIENT_ID,      // The ID of the client application registered with the User Pool
};

// Create a new instance of CognitoUserPool using the poolData configuration.
const userPool = new CognitoUserPool(poolData);

// Export the created userPool instance to be used in other parts of the application.
export default userPool;
