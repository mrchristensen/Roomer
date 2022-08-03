# Readme

Documentation, Front and Backend files for Roomer Website.

roomer-expo-app/ contains all React Native files

Backend/ contains the lambda layer files used in AWS Lambda Layers

AWS Services:

Cognito
 - handles user authentication

Amplify
 - hosts website client

SES
 - enables users sending emails to each other

Lambda
 - functions triggered by API gateway
 - Lambda layer contains all Data Access Object files

API Gateway
 - gateway for all backend endpoints

DynamoDB
 - Database for user table (not user credentials)

EC2
 - an instance runs our MongoDB
