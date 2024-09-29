# Tasks API

## Table of Contents

1. [Description](#description)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Testing](#testing)
7. [Development Setup](#development-setup)
8. [Author](#author)

## Description

**Tasks API** is a RESTful API built with Node.js, Express.js, and TypeScript for managing user tasks. Each task includes a title, description, status, creation, and modification dates. It allows users to perform CRUD operations on tasks, filter tasks by status, change the status of tasks, and calculate the time elapsed since a task was created.

## Features

- Create a new task
- Retrieve all tasks
- Retrieve a specific task by ID
- Update a task (title and description)
- Delete a task by ID
- Filter tasks by status (pending, in-progress, completed, deleted)
- Change the status of a task
- Calculate the number of days elapsed since a task's creation

## Technologies Used

- Node.js
- Express.js
- TypeScript
- PostgreSQL with TypeORM
- Docker
- Jest
- Swagger

## Prerequisites

Ensure that Docker is installed and running on your system. You can download Docker from the [official Docker website](https://www.docker.com/products/docker-desktop) or follow the installation instructions in the [Docker documentation](https://docs.docker.com/get-docker/).

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/delucajuan/tasks-api.git
   cd tasks-api
   ```

2. Create a `.env` file in the project root and add the necessary environment variables (you can reference the provided `env.example` file):

   ```plaintext
   # Application Port
   PORT=3000

   # Database Configuration
   DB_PORT=5432
   DB_USERNAME=user
   DB_PASSWORD=123456
   DB_NAME=tasks
   ```

3. Build and run the Docker containers:

   ```bash
   docker-compose up
   ```

4. The API will be accessible at [http://localhost:3000](http://localhost:3000) and the documentation at [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/). If a different port is set in the `.env` file, replace 3000 with the configured port.

## Testing

To run the unit tests, use the following command:

```bash
docker-compose run --rm test
```

## Development Setup

Additionally, if you want to develop or customize the application, install local dependencies:

```bash
npm install
```

## Stopping the Application

When you are finished working with the application, stop and remove the Docker containers by running:

```bash
docker-compose down
```

## Author

Developed by [Juan De Luca](https://github.com/delucajuan).
