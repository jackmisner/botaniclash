# POST /users

Registers a new user and automatically creates an associated game stats record.

## Request

### URL

`POST /users`

### Headers

None required.

### Body Parameters

| Field     | Type   | Description                              |
|-----------|--------|------------------------------------------|
| username  | string | **Required.** Must be unique and up to 50 characters. |
| password  | string | **Required.** Plain text password.       |

#### Example

```json
{
    "username": "plantlover123",
    "password": "securepassword"
}
```

## Response

### Success (201 Created)

Returns a confirmation message and the ID of the newly created user.

#### Example

```json
{
    "message": "OK",
    "user_id": 42
}
```

| Field    | Type   | Description                              |
|----------|--------|------------------------------------------|
| message  | string | Confirmation message ("OK").            |
| user_id  | uint   | Unique identifier of the user.           |

### Error Responses

#### 400 Bad Request

Occurs if required fields are missing or invalid.

##### Example 1

```json
{
    "error": "Must supply username and password"
}
```

##### Example 2

```json
{
    "error": "invalid character '...'"
}
```

#### 500 Internal Server Error

Occurs if the user could not be created due to a database error (e.g., duplicate username).

##### Example

```json
{
    "error": "UNIQUE constraint failed: users.username"
}
```

## Notes

- The password is securely hashed before being stored.
- A corresponding game stats record is automatically created with `GamesPlayed = 0` and `GamesWon = 0`.
- If game stats creation fails, the user will still be successfully created.
