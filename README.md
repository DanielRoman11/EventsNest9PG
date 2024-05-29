<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

This project is a refactor of the [events API](https://github.com/DanielRoman11/backend-events) repository, this project uses fastify, SWC and TypeORM 10. This project is looking for change the deprecated library of typeorm 7 that is been used on the original events API. 

## Getting Started
To get started with the project, you have two options. The first option is to have run NodeJs locally in a version equal to or higher than version 20 and set up a MySql database, everything in this option is on you. This project uses Docker so it is recommended that it is installed on your machine either locally or via WSL.

Most projects of this profile uses DevContainers, so you can initialized everything using Visual Studio Code and Docker.

### Setup
<ol>
  <li>
    <p>Clone the repository on your local machine</p>
    
    $ git clone https://github.com/DanielRoman11/backend-events.git
  </li>
  <li>
    <p>Navigate to the project folder</p>
    
     $ cd <project-directory>
  </li>
</ol>
   
### Docker Project Installation
There is already a default configuration that works perfectly for you Dockerfiles, but you can always experiment with the options offered by the Docker. Personally I prefer to use `pnpm` and you may prefer `bun` or `npm` itself, so this is up to you.

> [!IMPORTANT]
> It may seem obvious and redundant, but you must have Docker installed.

#### Docker Compose
You just have to run the following commands.

> [!WARNING]
> I highly recommend install it using `npm i -g pnpm`. If you don't have this dependencie install, you might experiment some problems.

<ol>
  <li>Install the project via docker compose</li>

    # First Time
    $ docker compose -f docker-compose.dev.yml up --build
  <li><strong>Only if you have everything setup</strong>. This point is just for running the project withouth building everything again</li>

    $ docker compose -f docker-compose.dev.yml up
</ol>

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
