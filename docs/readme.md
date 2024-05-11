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

1. Copy .env, and change DATABASE setting

```bash
cp env-example-document .env
```

2. install

```bash
pnpm install
```

3. setup database

```bash
pnpm migration:run
```

4. run seed data

```bash
pnpm seed:run:relational
```

4. run app

```bash
pnpm start:dev
```

## Source

- https://github.com/brocoders/nestjs-boilerplate.git
