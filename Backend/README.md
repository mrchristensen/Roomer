# Backend Information

## DAO

This contains all the DAO files in one node js module.
Share this code on AWS using Lambda Layers.

1. Zip the DAO folder
2. Go to https://us-east-2.console.aws.amazon.com/lambda/home?region=us-east-2#/layers and create a new version for the layer named "DAO"
3. Upload the DAO.zip to the new layer version
4. Update all necessary lambdas to the new version of the layer DAO

This prevents lots of code repetition for dao functions.
