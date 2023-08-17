# NC News API

## Summary
NC News is an API built for the purpose of accessing and interacting with data for a news site - such as users, comments and articles. This will later be accessed and displayed via the front-end architecture.

Comprehensive endpoints documentation can be found in endpoints.json.

You can find the hosted version of the API here: https://dish-nc-news.onrender.com

## Installation Instructions

The NC News API is an Express App which interacts with a psql database using Node. You'll need the following minimum versions of Node and Postgres to run the project:

- Node: v16.20.0  
- Postgres: v15.3 

You should then run 'npm install' to install the following dependencies: 

- dotenv: "^16.0.0"
- express: "^4.18.2"
- fs.promises: "^0.1.2"
- pg: "^8.7.3"
- pg-format: "^1.0.4"


In order to connect to the test and development databases locally, create .env.development and .env.test files. The contents of these should be PGDATABASE=nc_news and PGDATABASE=nc_news_test respectively in order to set the environment variables. 

Once you have done this, you can set-up and then seed your database by running the following scripts: "setup-dbs" then "seed".