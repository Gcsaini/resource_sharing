# Expiring Temporary Resource Sharing Module

## Objective

This backend module allows users to share temporary resources (e.g., documents, links, or files) for a specified duration. After the expiration time, resources become inaccessible. The module supports querying resources based on their status (active/expired) and ensures secure, efficient access management.

---

## Features

- **Create Temporary Resources**: Upload or register resources with a specified expiration time.
- **Access Control**: Provide secure access links using unique tokens.
- **Auto-Expiry**: Automatically mark resources as expired when the expiration time is reached.
- **Query Resources**: Retrieve resources by their status (`active` or `expired`).
- **Efficient Operations**: Handle large datasets (1000+ resources per user).

---

## Tech Stack

- **Backend**: Node.js with Express
- **Database**: PostgreSQL/MySQL
- **Scheduler**: Cron job or queue system for managing resource expiration

## Database Schema
- ** Added the schema files in models/* directory

## API Endpoints
- **Authentication
*Register
URL: /user/register
Method: POST
Description: Create a new user with email id and name for temporary use.
Body:email,name

*Login
URL: /user/login
Method: POST
Description: login user with email id.
Body:email
Res:token

-**Resources
URL: /resources
Method: POST
Description: Create a new temporary resource with a specified expiration time and resource_url but only the user have ticket can create the resource.
Body:resource_url and expiration_time
Res:sharing_url with access token

URL: /resources
Method: GET
Description: get all the resources or we can use the filter option like status=active or status=expired.
Res:All resoruces

URL: /resources/:id
Method: GET
Description: get  the spcified resources by id.
Res:specified resoruces data


URL: /resources/:id
Method: DELETE
Description: delete  the spcified resources by id but only the owner can delete the resource.
Res:delete specified resoruce

URL: /resources/share/:token
Method: GET
Description: get the resouce by token.
Res:resoruce having the specified token.


## Expiry Logic
The module employs a scheduled task using cron jobs to periodically check and update the status of resources. 
Once the current time surpasses the expiration_time of a resource, the system flags it as expired (is_expired: true). 
Expired resources become inaccessible, and attempts to access them will result in appropriate error responses.

## Security
-- Access Tokens: Each resource is assigned a unique access token, which is included in the resource URL. This token is required to access the resource, ensuring that only users with the link can view it.
-- Access Control: Only the owner of a resource can delete it. Unauthorized access or deletion attempts are properly handled with error responses.
-- Data Protection: All sensitive data is stored securely in the database, and best practices are followed to protect against common security vulnerabilities.

## Setup Instructions
Prerequisites
-- Node.js: v14.x or higher
-- npm: v6.x or higher
-- Database:MySQL
-- Git: For version control

#Installation
-- 1.Clone the Repository -> git clone https://github.com/Gcsaini/resource_sharing/new/main?filename=README.md
-- 2.Install Dependencies. run command ->npm install
-- 3.Configure Environment Variables.put your database details like dbname,username, pass and host etc
-- 4.Put the db details in config/config.json file.Run the command for migration it will create the tables into database -> npx sequelize-cli db:migrate
-- 5.Start the server like - npm run start
-- 6.The server should now be running at http://localhost:PORT.

## Usage

Once the server is running, you can interact with the API endpoints to manage temporary resource sharing. Ensure that you include authentication tokens (e.g., JWT) in your requests as required by your authentication setup.
- Register yourself by hitting the register api
- Login with the same email
- use the token to the every request for resources like create,get,delete etc
- after creating the resource get the sharing_url with expiration time
- get the sharing resource by hitting the endpoints - resources/share/token

## Using Postman
-- get the attached postman file import this file into your postman to get all the endpoints. there are file named as - "resources.postman_collection.json" and "users.postman_collection.json"
