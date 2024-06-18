
# REST API

## Installation

Install my-project with npm

```bash
    docker-compose up -d
```
## API Reference

#### New User Registration

```http
  POST /auth/register
```

| Parameter | Type     | Description                 |
| :-------- | :------- | :-------------------------- |
| `email`   | `string` | **Required**. Your email    |
| `password`| `string` | **Required**. Your password |

#### User Authorization

```http
  POST /auth/login
```

| Parameter | Type     | Description                 |
| :-------- | :------- | :-------------------------- |
| `email`   | `string` | **Required**. Your email    |
| `password`| `string` | **Required**. Your password |

#### Creating a new task

```http
  POST /tasks
```

| Parameter    | Type     | Description                    |
| :----------- | :------- | :----------------------------- |
| `title`      | `string` | **Required**. Task title       |
| `description`| `string` | **Required**. Task description |

#### Getting a list of all tasks of the current user

```http
  GET /tasks
```

#### Getting information about a specific task of the current user

```http
  GET /tasks/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of task to fetch |

#### Updates the current user's task information

```http
  PUT /tasks/${id}
```

| Parameter     | Type     | Description                   |
| :------------ | :------- | :---------------------------- |
| `id`          | `string` | **Required**. Id of task      |
| `description` | `string` | **Required**. new description |
| `status`      | `string` | **Required**. new status      |

#### Deletes the current user's task information

```http
  delete /tasks/${id}
```

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `id`      | `string` | **Required**. Id of task to delete |