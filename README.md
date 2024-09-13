<a name="readme-top"></a>

<h3 align="center">REST API for Whalar Game of Thrones</h3>

<!-- TABLE OF CONTENTS -->
<summary>Table of Contents</summary>
<ol>
  <li>
    <a href="#about-the-project">About The Project</a>
    <ul>
      <li><a href="#system-architecture">System Architecture</a></li>
      <li><a href="#database-design">Database Design</a></li>
      <li><a href="#openapi-documentation">OpenAPI Documentation</a></li>
      <li><a href="#project-structure">Project Structure</a></li>
      <li><a href="#tools-and-technologies">Tools & Technologies</a></li>
    </ul>
  </li>
  <li>
    <a href="#getting-started">Getting Started</a>
    <ul>
      <li><a href="#installation">Installation</a></li>
    </ul>
  </li>
</ol>



<!-- ABOUT THE PROJECT -->
## About The Project

### Database Design

Database diagram [link](https://dbdiagram.io/d/characters-db-diagramm-66dc09dfeef7e08f0ef9dc32) 

![Database Design][database-design]

### OpenAPI Documentation

OpenAPI documentation once applications is running: [link](http://localhost:5500/docs)

![OpenAPI Documentation][openapi-doc]

### Project Structure

![Project structure Documentation][project-structure]

### Tools and Technologies
- [x] Typescript, Fastify, Typebox
- [x] RESTful APIS. [here](/src/routes/public/character.ts)
- [x] OpenAPI documentation. Url is http://localhost:5500/docs
- [x] RabbitMq is connected and working. Implementation is [here](/src/message-queues/consumers/) and [here](/src/managers/event-manager.ts) 
- [x] [Dockerfile.prod](Dockerfile.prod) and [Dockerfile.dev](Dockerfile.dev) and [docker-compose.yml](docker-compose.yaml) is created
- [x] Added unit tests [here](/test/unit/routes/character.test.ts)
- [x] Added integration tests [here](/test/integration/routes/public/characters/)
- [x] Coverage is applied once run `npm run test:cov` and can be found under coverage folder 
- [x] ESlint used for linting
- [x] Prettier used for fomating code
- [x] Custom scripts [here](scripts) is written for creating seeds from [got-characters.json](scripts/got-characters.json). KnexJS library used for uploading data

### Not applied
- [ ] Elastic search
- [ ] CI (github actions)
- [ ] Mutant and performance tests

<!-- GETTING STARTED -->
## Getting Started
To set up the project locally, you have to follow installation instructionss

### Installation
Clone the project using following command:
```sh
git clone https://github.com/eazygood/whalar-got.git
```

### Run on Locally

Follow these steps to run the project locally:
1. Move to project directory
   ```sh
   cd whalar-got && make build-prod
   ```
Note: if you run test `npm run test` and got error according `..."/.+ Started!/.."` please use run 
  ```sh
  export TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE="/var/run/docker.sock"
  ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
[database-design]: docs/db.png
[openapi-doc]: docs/swagger.png
[project-structure]: docs/project-structure.png