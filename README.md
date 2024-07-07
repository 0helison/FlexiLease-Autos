# FlexiLease Autos API

---

## - Description

This challenge aimed to create an API for a car rental company, using the Express framework, TypeORM, and integrating MongoDB with Node.js.

---

#### Node version:
```bash
20.11.1
```

#### NPM version:
```bash
10.2.4
```

#### Libs:
```bash
"axios": "^1.7.2",
"bcryptjs": "^2.4.3",
"cors": "^2.8.5",
"date-fns": "^3.6.0",
"dotenv": "^16.4.5",
"express": "^4.19.2",
"express-async-errors": "^3.1.1",
"jsonwebtoken": "^9.0.2",
"mongodb": "^5.9.2",
"reflect-metadata": "^0.2.2",
"tsyringe": "^4.8.0",
"typeorm": "^0.3.20",
"uuid": "^9.0.1",
"zod": "^3.23.8"
```

#### Framekors:
```bash
"express": "^4.19.2"
```

---

## - Installation
On your local machine, create a directory and insert the following command:
```bash
https://github.com/0helison/FlexiLease-Autos.git .
```
After cloning the repository, execute to run the application:
```bash
docker-compose up --build
```
---

## - Database, Port Configuration and JWT
Create a `.env` file in the project root and fill it as per the example in `.env.example`:
```bash
PORT = 3333
DATABASE=api_auto
JWT_SECRET=4056e5cf34b1550890165b9cd0f4643f
JWT_EXPIRES_IN=12h
```
- PORT=3333 → port your application will use;
- DB_DATABASE=api_auto → name of the database to be created;
- JWT_SECRET=4056e5cf34b1550890165b9cd0f4643f →  Your Secret JWT;
- JWT_EXPIRES_IN=12h → How long does the token expire;
---

## - Swagger Documentation

Access the API through the base URL:
```bash
http://localhost:3333/api/v1/doc
```

## - Tests
##### - Run all tests and achieve application coverage
On your local terminal, insert the following command:
```bash
docker exec -it api-flexilease-app npm run test:cov
```

##### - Only run integration tests
On your local terminal, insert the following command:
```bash
docker exec -it api-flexilease-app npm run test:integration
```

##### - Only run e2e tests
On your local terminal, insert the following command:
```bash
docker exec -it api-flexilease-app npm run test:e2e
```
---

# Entity - User and Auth

###  - Endpoints
-
  ```
    post -> ('/api/v1/auth/') - Create a authentication for user.
    post -> ('/api/v1/user/') - Create a new user.
    get -> ('/api/v1/user/') - List all the users or just a part defined by a parameter.
    get -> ('/api/v1/user/:id') - List a specific user.
    put -> ('/api/v1/user/:id') - Update a specific user.
    delete -> ('/api/v1/user/:id') - Delete a specific user.
  ```
---
# Entity - Car

###  - Endpoints
-
  ```
    post -> ('/api/v1/car/') - Create a new car.
    get -> ('/api/v1/car/') - List all the cars or just a part defined by a parameter.
    get -> ('/api/v1/car/:id') - List a specific car.
    put -> ('/api/v1/car/:id') - Update a specific car.
    patch -> ('/api/v1/car/:id/accessories/:accessoryId') - Update a specific accessory of car.
    delete -> ('/api/v1/car/:id') - Delete a specific car.
  ```
 ---
# Entity - Reserve

###  - Endpoints
-
  ```
    post -> ('/api/v1/reserve/') - Create a new reserve.
    get -> ('/api/v1/reserve/') - List all the reserves or just a part defined by a parameter.
    get -> ('/api/v1/reserve/:id') - List a specific reserve.
    put -> ('/api/v1/reserve/:id') - Update a specific reserve.
    delete -> ('/api/v1/reserve/:id') - Delete a specific reserve.
  ```
---


