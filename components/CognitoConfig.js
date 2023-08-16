import { CognitoUserPool } from "amazon-cognito-identity-js";
import { POOL_ID } from "@env";
import { CLIENT_ID } from "@env";

const poolData = {
  UserPoolId: POOL_ID,
  ClientId: CLIENT_ID,
};

const userPool = new CognitoUserPool(poolData);

export default userPool;
