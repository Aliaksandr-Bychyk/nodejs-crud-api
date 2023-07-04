# nodejs-crud-api

After clone repository run this command to install all necessary packages

```

npm i

```

Use `npm run start:dev` to run application in development mode.
Use `npm run start:prod` to run application in production mode.
Use `npm run start:mulit` to run application with a load balancer.

Use `npm run test` to run tests or `npm run test:verbose` to run verbose tests.

Please use **Postman** application to make responce.

```

GET
localhost:3000/api/users            // Get all users records
localhost:3000/api/users/{userId}   // Get current user record

POST
localhost:3000/api/users            // Create new record with  
                                       provided data

PUT 
localhost:3000/api/users/{userId}   // Update current user record
                                       with provided data

DELETE 
localhost:3000/api/users/{userId}   // Delete current user record

```
