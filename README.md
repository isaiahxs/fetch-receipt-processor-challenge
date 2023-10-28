# Getting started: Receipt Processor API

## [View My Live Site!](https://isaiah-backend-fetch.onrender.com/)

This project is a full-stack Receipt Processor using Node.js, Express, UUID, and React. Below are the instructions to set up the environment for running this project on any OS. 

<strong>My project includes server-side and client-side validations, modularized functions, a caching point system to increase efficiency and reduce redundant calls, and it includes Jest tests.

![Landing Page](https://github.com/isaiahxs/fetch-receipt-processor-challenge/assets/107521578/4f6800bf-a02e-4567-8020-008a72529fb0)

## Pre-requisites
1. Node.js (v14.x.x or higher)
2. npm (v7.x.x or higher)

## Installing Node.js and npm on different operating systems

### Windows
1. Download the Node.js installer from the [official website](https://nodejs.org/en/download/).
2. Run the installer and follow the setup wizard to install Node.js and npm.

### macOS
You can use Homebrew to install Node.js:
```
brew install node
```

Or download the installer from the [official website](https://nodejs.org/en/download/).

### Linux (Ubuntu)
Run the following commands in your terminal:
```
sudo apt update
sudo apt install nodejs npm
```

## Clone the Repository

Clone the repository into your local machine with one of the following methods:

HTTPS
```
https://github.com/isaiahxs/fetch-backend-take-home.git
```

SSH
```
git@github.com:isaiahxs/fetch-backend-take-home.git
```

GitHub CLI:
```
gh repo clone isaiahxs/fetch-backend-take-home
```

Navigate into the project directory:
```
cd fetch-backend-take-home
```

## Install dependencies

To install the required backend dependencies, run the following from within the backend directory:
```
npm install
```

To install the required frontend dependencies, run the following from within the frontend directory:
```
npm install
```
```
npm run build
```

## Run the Server

Once the dependencies are installed, enter the backend directory and run the server using 
```
npm start
```

This will start the server on `http://localhost:3001`. You can make API requests to this URL using Postman or curl.

If you'd like to use the frontend, run the following from within the frontend directory as well:

```
npm start
```

This will open the client-side on `http://localhost:3000`.

## Running Tests with Jest
Once the dependencies are installed, to run server-side tests, run the following command from the backend directory of the project:

```
npm run test
```

## Random Receipt ID + Point Breakdown
![Receipt IDs and Points](https://github.com/isaiahxs/fetch-receipt-processor-challenge/assets/107521578/9ec01dbc-cbb7-4eeb-9d48-bbab494ef05b)


## Breakdown Examples
![Example Breakdown](https://github.com/isaiahxs/fetch-receipt-processor-challenge/assets/107521578/a934714f-c50a-42c6-8a2e-26689c3c9216)
![Example 2 Breakdown](https://github.com/isaiahxs/fetch-receipt-processor-challenge/assets/107521578/a042807d-ecd6-40e2-bd81-06c17135410a)


## Footer
![Footer](https://github.com/isaiahxs/fetch-receipt-processor-challenge/assets/107521578/67a37940-c79c-4220-ae52-ef031f63a0ef)


## Navigation Panel
![Nav Panel](https://github.com/isaiahxs/fetch-receipt-processor-challenge/assets/107521578/c39f0d17-f499-4989-8e10-56baae42289c)


# Challenge Instructions
Build a web service that fulfills the documented API. The API is described below. A formal definition is provided 
in the [api.yml](./api.yml) file, but the information in this README is sufficient for the completion of this challenge. We will use the 
described API to test your solution.

Provide any instructions required to run your application.

Data does not need to persist when your application stops. It is sufficient to store information in memory. There are too many different database solutions, we will not be installing a database on our system when testing your application.

## Language Selection

You can assume our engineers have Go and Docker installed to run your application. Go is our preferred language, but it is not a requirement for this exercise.

If you are using a language other than Go, the engineer evaluating your submission may not have an environment ready for your language. Your instructions should include how to get an environment in any OS that can run your project. For example, if you write your project in Javascript simply stating to "run `npm start` to start the application" is not sufficient, because the engineer may not have NPM. Providing a docker file and the required docker command is a simple way to satisfy this requirement.

## Submitting Your Solution

Provide a link to a public repository, such as GitHub or BitBucket, that contains your code to the provided link through Greenhouse.

---
## Summary of API Specification

### Endpoint: Process Receipts

* Path: `/receipts/process`
* Method: `POST`
* Payload: Receipt JSON
* Response: JSON containing an id for the receipt.

Description:

Takes in a JSON receipt (see example in the example directory) and returns a JSON object with an ID generated by your code.

The ID returned is the ID that should be passed into `/receipts/{id}/points` to get the number of points the receipt
was awarded.

How many points should be earned are defined by the rules below.

Reminder: Data does not need to survive an application restart. This is to allow you to use in-memory solutions to track any data generated by this endpoint.

Example Response:
```json
{ "id": "7fb1377b-b223-49d9-a31a-5a02701dd310" }
```

## Endpoint: Get Points

* Path: `/receipts/{id}/points`
* Method: `GET`
* Response: A JSON object containing the number of points awarded.

A simple Getter endpoint that looks up the receipt by the ID and returns an object specifying the points awarded.

Example Response:
```json
{ "points": 32 }
```

---

# Rules

These rules collectively define how many points should be awarded to a receipt.

* One point for every alphanumeric character in the retailer name.
* 50 points if the total is a round dollar amount with no cents.
* 25 points if the total is a multiple of `0.25`.
* 5 points for every two items on the receipt.
* If the trimmed length of the item description is a multiple of 3, multiply the price by `0.2` and round up to the nearest integer. The result is the number of points earned.
* 6 points if the day in the purchase date is odd.
* 10 points if the time of purchase is after 2:00pm and before 4:00pm.


## Examples

```json
{
  "retailer": "Target",
  "purchaseDate": "2022-01-01",
  "purchaseTime": "13:01",
  "items": [
    {
      "shortDescription": "Mountain Dew 12PK",
      "price": "6.49"
    },{
      "shortDescription": "Emils Cheese Pizza",
      "price": "12.25"
    },{
      "shortDescription": "Knorr Creamy Chicken",
      "price": "1.26"
    },{
      "shortDescription": "Doritos Nacho Cheese",
      "price": "3.35"
    },{
      "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
      "price": "12.00"
    }
  ],
  "total": "35.35"
}
```
```text
Total Points: 28
Breakdown:
     6 points - retailer name has 6 characters
    10 points - 4 items (2 pairs @ 5 points each)
     3 Points - "Emils Cheese Pizza" is 18 characters (a multiple of 3)
                item price of 12.25 * 0.2 = 2.45, rounded up is 3 points
     3 Points - "Klarbrunn 12-PK 12 FL OZ" is 24 characters (a multiple of 3)
                item price of 12.00 * 0.2 = 2.4, rounded up is 3 points
     6 points - purchase day is odd
  + ---------
  = 28 points
```

----

```json
{
  "retailer": "M&M Corner Market",
  "purchaseDate": "2022-03-20",
  "purchaseTime": "14:33",
  "items": [
    {
      "shortDescription": "Gatorade",
      "price": "2.25"
    },{
      "shortDescription": "Gatorade",
      "price": "2.25"
    },{
      "shortDescription": "Gatorade",
      "price": "2.25"
    },{
      "shortDescription": "Gatorade",
      "price": "2.25"
    }
  ],
  "total": "9.00"
}
```
```text
Total Points: 109
Breakdown:
    50 points - total is a round dollar amount
    25 points - total is a multiple of 0.25
    14 points - retailer name (M&M Corner Market) has 14 alphanumeric characters
                note: '&' is not alphanumeric
    10 points - 2:33pm is between 2:00pm and 4:00pm
    10 points - 4 items (2 pairs @ 5 points each)
  + ---------
  = 109 points
```

---

# FAQ

### How will this exercise be evaluated?
An engineer will review the code you submit. At a minimum they must be able to run the service and the service must provide the expected results. You
should provide any necessary documentation within the repository. While your solution does not need to be fully production ready, you are being evaluated so
put your best foot forward.

### I have questions about the problem statement
For any requirements not specified via an example, use your best judgment to determine the expected result.

### Can I provide a private repository?
If at all possible, we prefer a public repository because we do not know which engineer will be evaluating your submission. Providing a public repository
ensures a speedy review of your submission. If you are still uncomfortable providing a public repository, you can work with your recruiter to provide access to
the reviewing engineer.

### How long do I have to complete the exercise?
There is no time limit for the exercise. Out of respect for your time, we designed this exercise with the intent that it should take you a few hours. But, please
take as much time as you need to complete the work.
