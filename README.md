# TASK MANAGEMENT SYSTEM

## Description

This repo is a small project that aims to use multiple databases with TypeORM configuration and caching with Redis.

A Postman collection sample is provided in the `postman` directory to test out the API.

## Prerequisites

- [Docker](https://www.docker.com/)
- [NodeJS (v16)](https://nodejs.org/en/download/)
- [Postman](https://www.postman.com/downloads/)

## Installation

Install the dependencies:

`npm install`

This repo makes use of PosgreSQL and MongoDB databases and Redis server. If you have no setup for these, then you can use Docker to run containers for them.
You can have more information on Docker [here](https://docs.docker.com/).

If not installed, install Docker Desktop:
[Download Docker](https://www.docker.com/get-started/)

Pull the images:

- `docker pull mongo` [(More info on Mongo image)](https://hub.docker.com/_/mongo)
- `docker pull postgres` [(More info on Postgres image)](https://hub.docker.com/_/postgres)
- `docker pull redis` [(More info on Redis image)](https://hub.docker.com/_/redis)

The environment variables you see in the `.env.example` file will help you set up the project and docker containers. Create an `.env` file in the root directory and set the environment variables in accordance with the `.env.example` file. Do not forget to fill the missing ones.

Now you should be ready to run the docker containers. Using the environment variables you set in the `.env` file, run the docker containers with the below commands:

Postgres database:

- `docker run --rm -p 5432:5432 --name <postgres_container_name> -e POSTGRES_USER=<user> -e POSTGRES_PASSWORD=<password> -e POSTGRES_DB=<postgres_database_name> postgres:latest`

MongoDB database:

- `docker run --rm -p 27017:27017 --name <mongo_container_name> -v mongo-data:/data -e MONGO_INITDB_DATABASE=<mongodb_database_name> mongo:latest`

Redis:

- `docker run -h redis --rm -p 6379:6379 --name <redis_container_name> -v redis-data:/data redis:latest`

## Run the Express Server

Build:

`npm run build`

Start:

`npm start`

Or just run the server in the development environment.

`npm run dev`
