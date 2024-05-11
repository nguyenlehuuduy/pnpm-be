# NestJS Boilerplate Documentation

---

## Table of Contents

- [Introduction](introduction.md)
- [Installing and Running](installing-and-running.md)
- [Working with database](database.md)
- [Auth](auth.md)
- [Serialization](serialization.md)
- [File uploading](file-uploading.md)
- [Tests](tests.md)
- [Benchmarking](benchmarking.md)
- [Automatic update of dependencies](automatic-update-dependencies.md)

## Installation

**Note**: Server use postgresql

0. Run postgresql database using docker (optionally if you don't have postgresql installed)

```bash
docker compose -f docker-compose-database.yml up -d
```

1. Copy .env, and change DATABASE setting

```bash
cp env-example-document .env
```

2. install

```bash
pnpm install
```

3. Sync database with models

```bash
pnpm migration:run
```

4. Run seed data

```bash
pnpm seed:run:relational
```

5. Run app (development mode)

```bash
pnpm start:dev
```

## Main Packages

Main packages used in this project, should read them before working on.

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [Swagger](https://swagger.io/)
- [Passport](http://www.passportjs.org/)
- [class-validator]()
- [class-transformer]()
- [Langchain]()

## Source

- https://github.com/brocoders/nestjs-boilerplate.git
