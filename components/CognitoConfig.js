import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-2_9j48lom5R",
  ClientId: "125mg33jqkn13vpccf8fmbvgv2",
};

const userPool = new CognitoUserPool(poolData);

export default userPool;
