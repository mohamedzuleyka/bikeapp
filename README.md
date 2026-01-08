# bikeapp

# Bike Shop Microservices App 🚲

A full-stack, cloud-native microservices application built on AWS.

## 🔧 Tech Stack

**Frontend**
- React (Vite)
- Axios
- React Router
- Amazon Cognito (Auth)

**Backend**
- AWS Lambda (Python)
- Amazon API Gateway
- Amazon DynamoDB
- AWS SAM

**Infrastructure**
- IAM (least-privilege roles)
- CloudFront (API distribution)
- S3 (image hosting)

---

## 🧠 Architecture Overview

- Users authenticate via **Amazon Cognito**
- Frontend communicates with **API Gateway**
- API Gateway routes requests to Lambda microservices
- Each Lambda interacts with DynamoDB
- Images are served from S3
- CORS handled at API Gateway + Lambda response level


