# GET /game_stats

Retrieve game statistics for all users.

## Request

### URL

`GET /game_stats`

### Headers

None required.

---

## Response

### Success (200 OK)

Returns a JSON object containing an array of game statistics. Each object includes the user ID, username, games played, and games won.

```json
{
    "game_stats": [
        {
            "UserID": 42,
            "Username": "plantlover123",
            "GamesPlayed": 5,
            "GamesWon": 3
        },
        {
            "UserID": 7,
            "Username": "greenthumb",
            "GamesPlayed": 10,
            "GamesWon": 6
        }
        // ... more user stats
    ]
}
```

#### Fields

| Field        | Type   | Description                              |
|--------------|--------|------------------------------------------|
| `UserID`     | uint   | Unique identifier of the user            |
| `Username`   | string | Username associated with the user        |
| `GamesPlayed`| int    | Total number of games the user has played|
| `GamesWon`   | int    | Total number of games the user has won   |

---

### Error Responses

#### 500 Internal Server Error

Occurs if there is a server-side issue fetching game stats or user data.

```json
{
    "error": "Failed to get username"
}
```

or

```json
{
    "error": "Database error message here"
}
```

---

## Notes

- This endpoint is public and does not require authentication.
- Users without retrievable usernames are excluded from the response.
