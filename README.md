# Roomer

Roomer is an app/website that reverses the housing market. Buyers create in-search-of posts (ISOs) of wanted housing. IE: "Looking for a one bedroom apt in Bellevue..." Sellers can browse posts and message sellers about their open apartments/housing.

[![](/misc-resources/homepage.JPG)](https://www.figma.com/file/Z2QJRuX5a0RZ6fZ00GSlfp/Roomer)

This repo contains the final MVP prototype. This prototype was created as the capstone project of 5 students over the course of two semesters.

The final prototype can be viewed at: [https://www.roomerhasit.net/](https://www.roomerhasit.net/)

The UX design can be see here: [https://www.figma.com/file/Z2QJRuX5a0RZ6fZ00GSlfp/Roomer](https://www.figma.com/file/Z2QJRuX5a0RZ6fZ00GSlfp/Roomer)

## Tech Stack

- React Native (frontend)
- Expo (continuous integration and deployment)
- AWS (backend)
- MongoDB (database)
- Google Maps (map/POI)
- Figma (prototype)

![](misc-resources/tech-stack.jpg)

## Directories

[roomer-expo-app/](roomer-expo-app/) contains all the React Native files for the front end. Expo is used to run and deploy the application.

[Backend/](Backend/) contains the lambda layer files used in AWS Lambda Layers. [Backend/DAO/Dao](Backend/DAO/Dao) contains the code used for each Lambda Function.

[Roomer.fig](Roomer.fig) contains the Figma file of the UX design and prototype. This prototype can also be see online: [figma.com/file/Z2QJRuX5a0RZ6fZ00GSlfp/Roomer](https://www.figma.com/file/Z2QJRuX5a0RZ6fZ00GSlfp/Roomer)

## AWS Services

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

- database for user table (not user credentials)

EC2

- an instance runs our MongoDB

Simple Email Service

- handles the messaging between users
