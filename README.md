# Serverless Audio Recorder application

POC (work in progress) of serverless application hosted on AWS.

It's using *infrastructure as code* approach, based on *AWS SAM* and *CloudFormation*.

## UI
Simple React Application, hosted on a dedicated S3 Bucket

## Backend

REST API build on top of API Gateway and set of Lambdas.
Recorder audio files are stored in a Audio Files S3 Bucket.

Files are uploaded and downloaded directly from the bucket, using S3 signed URLs.

New File is propagated using SNS and a fanout pattern.

## Simplified architecture diagram:

![architecture](https://s3-eu-west-1.amazonaws.com/sosnowski-hosting/audio-recorder.png "Architecture Diagram")
