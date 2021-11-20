# GratiBox API

## Documentation 🧾

### Sign up

```
POST /sign-up
```

#### Expected body

```jsx
{
  name: String, at least 3 letters,
  email: String, at least 5 letters, must include @ and .something at the end,
  password: String, at least 8 letters, no differentiation between upper and lower cases,
}
```

#### Expected headers

```bash
None, this is a public route
```

#### Possible response status

```bash
- 400: You have forgotten to send something, or sent invalid data, check your parameters
- 409: This e-mail is already registered
- 201: Account created
```

</br>

### Sign in

```
POST /sign-in
```

#### Expected body

```jsx
{
  email: 'User email',
  password: 'User password',
}
```

#### Expected headers

```bash
None, this is a public route
```

#### Possible response status

```bash
- 400: You have forgotten to send something, or sent invalid data, check your parameters
- 404: This e-mail is not registered
- 401: Incorrect password
- 200: Logged In
```

#### What you will receive from this route

```jsx
{
  token: JWT,
  name: username,
}
```

</br>

### Subscribe

```
POST /subscribe
```

#### Expected body

```jsx
{
  plan: String, must be either "monthly" or "weekly",
  deliveryDate: String, must be "01", "10" or "20" if plan is "monthly", otherwise, must be "monday", "wednesday" or "friday",
  itemsWanted: Array, must include only numbers 1 to 3,
  zipcode: String, must be 8 letters long and include only numbers
  number: Number, is the house number
}
```

#### Expected headers

```jsx
{
  headers: {
    'x-access-token': JWT
  }
}
```

#### Possible response status

```bash
- 400: You have forgotten to send something, or sent invalid data, check your parameters
- 409: This account already has a subscription, check PUT method on this route
- 401: Your JWT is invalid
- 201: Subscribed
```

#### What you will receive from this route

```jsx
{
  newToken: JWT, if needed, further explanations on persistent login section
}
```

</br>

```
PUT /subscribe
```

#### Expected body

```jsx
{
  plan: String, must be either "monthly" or "weekly",
  deliveryDate: String, must be "01", "10" or "20" if plan is "monthly", otherwise, must be "monday", "wednesday" or "friday",
  itemsWanted: Array, must include only numbers 1 to 3,
  zipcode: String, must be 8 letters long and include only numbers
  number: Number, is the house number
}
```

#### Expected headers

```jsx
{
  headers: {
    'x-access-token': JWT
  }
}
```

#### Possible response status

```bash
- 400: You have forgotten to send something, or sent invalid data, check your parameters, or you dont have a subscription yet
- 401: Your JWT is invalid
- 200: Subscription changed
```

#### What you will receive from this route

```jsx
{
  newToken: JWT, if needed, further explanations on persistent login section
}
```

</br>

### User subscription

```
GET /user-subscription
```

#### Expected headers

```jsx
{
  headers: {
    'x-access-token': JWT
  }
}
```

#### Possible response status

```bash
- 401: Your JWT is invalid
- 200: Everything ok
```

#### What you will receive from this route

```jsx
{
  subscriptionId: String, will be either 1, meaning 'monthly' or 2, meaning 'weekly',
  newToken: JWT, if needed, further explanations on persistent login section
}
```

</br>

### User info

```
GET /user-info
```

#### Expected headers

```jsx
{
  headers: {
    'x-access-token': JWT
  }
}
```

#### Possible response status

```bash
- 401: Your JWT is invalid
- 200: Everything ok
```

#### What you will receive from this route

```jsx
{
  subscriptionName: String, will be either 'monthly' or 'weekly',
  subscriptionDate: String, will be on 'DD/MM/YYYY' format,
  wantedItems: Array, only numbers from 1 to 3,
  dates: Array, will have 3 dates on 'DD/MM/YYYY' format,
  newToken: JWT, if needed, further explanations on persistent login section
}
```

</br>

### Register feedback

```
POST /feedback
```

#### Expected body

```jsx
{
  boxId: Number, must be a valid deliveryId,
  feedbackId: Number, must be 1 for positive or 2 for negative,
  comment: String, must not be sent if feedbackId is 1, otherwise, must have at least 8 characters
}
```

#### Expected headers

```jsx
{
  headers: {
    'x-access-token': JWT
  }
}
```

#### Possible response status

```bash
- 400: You have forgotten to send something, or sent invalid data, check your parameters
- 403: Your boxId does not match your userId or you already rated this delivery
- 401: Your JWT is invalid
- 200: Feedback received
```

#### What you will receive from this route

```jsx
{
  newToken: JWT, if needed, further explanations on persistent login section
}
```

</br>

### Delivered boxes

```
GET /delivered-boxes
```

#### Expected headers

```jsx
{
  headers: {
    'x-access-token': JWT
  }
}
```

#### Possible response status

```bash
- 401: Your JWT is invalid
- 200: Everything ok
```

#### What you will receive from this route

```jsx
{
  dates: Array, will contain every box you have ever received, on the 'DD/MM/YYYY' format,
  newToken: JWT, if needed, further explanations on persistent login section
}
```

</br>

### Update boxes

```
GET /update-boxes
```

#### Expected headers

```jsx
{
  headers: {
    'x-access-token': JWT
  }
}
```

#### Possible response status

```bash
- 401: Your JWT is invalid
- 200: Everything ok
```

#### What you will receive from this route

```jsx
{
  newToken: JWT, if needed, further explanations on persistent login section
}
```

</br>

### Persist login

```
POST /persist-login
```

#### Expected body

```jsx
{
  token: JWT,
}

#### Expected headers

```bash
None
```

#### Possible response status

```bash
- 401: Your JWT is invalid
- 200: Everything ok
```

#### What you will receive from this route

```jsx
{
  newToken: JWT;
}
```

</br>

### How the persistent login works

```bash
# Every private route requests the JWT given to you at some point
# Thats because only logged users should be able to make those requests on the database
# Every JWT is valid for 15 minutes, after that, every private route you access would return 401 (unauthorized)
# To avoid user frustration, when the JWT is expired, every route also checks if the token is exactly the last one registered in the database
# If it is, the access is granted one more time, and a new token is given to the user
# That why every private route can give you a newToken
```

</br>

## How to run in your machine 🖥️

```
git clone https://github.com/bruch0/gratibox-API.git
```

```
cd gratibox-API
```

```
npm i --force
```

Create a .env.dev file and fill it using your environment variables following <a href="https://github.com/bruch0/gratibox-API/blob/main/.env.example">this example</a>

### In your terminal

```
sudo su postgres
```

```
psql
```

```
CREATE DATABASE gratibox
```

```
\c gratibox
```

Copy everything in the <a href="https://github.com/bruch0/gratibox-API/blob/main/dump.sql">dump.sql<a/> file and paste on the terminal</br>
You can not exit the postgres admin, and run

```
npm run start:dev
```

</br>

## How to run the tests in your machine 🖥️

Create a .env.test file and fill it using your environment variables following <a href="https://github.com/bruch0/gratibox-API/blob/main/.env.example">this example</a>

### In your terminal

```
sudo su postgres
```

```
psql
```

```
CREATE DATABASE gratibox_test;
```

```
\c gratibox_test
```

Copy everything in the <a href="https://github.com/bruch0/gratibox-API/blob/main/dump.sql">dump.sql<a/> file and paste on the terminal</br>

You can not exit the postgres admin, and run

```
npm run test
```

</br>
  
  
## Deployment 🚀

<p align="center"><a  href="https://gratibox-brucho.herokuapp.com/">You can check the server running on heroku here!</a></p>

</br>

### Contact

<div align="center">
  
  [![Gmail Badge](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:lucas.bruch0@gmail.com)
  [![Linkedin Badge](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/lucas-bruch)
  
</div>
