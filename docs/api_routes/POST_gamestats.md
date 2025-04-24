# POST /game_stats

This endpoint updates the game statistics for an authenticated user. It increments the number of games played and, if applicable, the number of games won.

## Request

### URL

`POST /game_stats`

### Required Headers

| Header          | Value                    |
|------------------|--------------------------|
| Authorization    | `Bearer {jwt_token}`     |

### Required Body Parameters

| Field   | Type   | Description                              |
|---------|--------|------------------------------------------|
| winner  | string | **Required.** Must be `"player"` or `"opponent"`. |

#### Example

```json
{
    "winner": "player"
}
```

## Response

### Success Response (200 OK)

Returns a JSON object containing the updated game statistics for the authenticated user.

#### Example

```json
{
    "game_stats": {
        "UserID": 42,
        "Username": "plantlover123",
        "GamesPlayed": 5,
        "GamesWon": 3
    }
}
```

| Field        | Type   | Description                              |
|--------------|--------|------------------------------------------|
| UserID       | uint   | Unique identifier of the user            |
| Username     | string | Username associated with the user ID     |
| GamesPlayed  | int    | Total number of games the user has played |
| GamesWon     | int    | Total number of games the user has won   |

### Error Responses

#### 400 Bad Request

If the request body is malformed, missing required fields, or the user ID is missing or invalid:

```json
{
    "error": "Invalid user ID format"
}
```

```json
{
    "error": "User ID not found in token"
}
```

```json
{
    "error": "Key: 'Winner' Error:Field validation for 'winner' failed on the 'oneof' tag"
}
```

#### 401 Unauthorized

If the JWT is missing or invalid:

```json
{
    "error": "Authorization header with JWT token is required"
}
```

```json
{
    "error": "Invalid token"
}
```

#### 500 Internal Server Error

If there is a server-side error during the update process:

```json
{
    "error": "Failed to get username"
}
```

```json
{
    "error": "Database error message here"
}
```

## Notes

- The user is identified via the JWT token, and their ID is extracted from it.
- Only `"player"` or `"opponent"` are valid values for `"winner"`.
- The number of games played is always incremented.
- The number of games won is incremented only if the `"winner"` is `"player"`.
- The returned response includes the updated stats and the username of the user.