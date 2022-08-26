const app = serverless.service.custom.app;
const region = serverless.service.provider.region;

const awsConfig = {
    production: true,
    awsExports: {
        aws_appsync_graphqlEndpoint: app.apiEndpoint,
        aws_appsync_region: region,
        aws_appsync_authenticationType: "AWS_IAM",
        Auth: {
            region,
            userPoolId: app.userPoolId,
            userPoolWebClientId: app.userPoolClientId,
            identityPoolId: app.userIdentityPoolId
        }
    }
};

const fs = require("fs");

fs.writeFileSync(
    "./.app/src/environments/environment.prod.ts",
    `export const environment = ${JSON.stringify(awsConfig)};`
);