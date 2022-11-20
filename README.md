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


The file `.env.example` will help you set up the environment variables for the project. Create an `.env` file in the root directory and set the environment variables accordingly. If you want to just test out this project, then leave everything as is, and assign a value to JWT_SECRET.

Now you should be able to build and run docker containers:

`docker compose up`

If you want to remove the containers after your work is done, then you can simply run:

`docker compose down`


## Run the Express Server

Build:

`npm run build`

Start:

`npm start`

Or just run the server in the development environment.

`npm run dev`
