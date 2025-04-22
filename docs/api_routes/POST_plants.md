# POST /plants

This endpoint compares two plant cards based on a specified statistic and determines a winner.

## Request

### URL
```
POST /plants
```

### Required Headers
```
Content-Type: "application/json"
Authorization: "Bearer {jwt_token}"
```

### Request Body Example
```json
{
  "player_card": 1,
  "opponent_card": 2,
  "stat_to_compare": "light"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `player_card` | uint | The ID of the player's plant card |
| `opponent_card` | uint | The ID of the opponent's plant card |
| `stat_to_compare` | string | The statistic to compare between the two plants |

Valid values for `stat_to_compare` include:
- `year`
- `light`
- `soil_nutriments`
- `atmospheric_humidity`
- `ph_range`
- `edible`

## Response

### Success Response (200 OK)
Returns a JSON object indicating the winner of the comparison and a new JWT token.

```json
{
  "winner": "player",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

The `winner` field can have one of three values:
- `"player"`: The player's plant card won the comparison
- `"opponent"`: The opponent's plant card won the comparison
- `"draw"`: Both plant cards have the same value for the compared statistic

The `token` field contains a new JWT token that should be used for subsequent authenticated requests.

### Error Responses

- **400 Bad Request**: If the request body is missing required fields or contains an invalid statistic
  ```json
  {
    "message": "player_card, opponent_card and stat_to_compare are required"
  }
  ```

  OR

  ```json
  {
    "error": "Invalid stat to compare: invalid_stat",
    "valid_stats": ["year", "light", "soil_nutriments", "atmospheric_humidity", "edible", "ph_range"]
  }
  ```

- **401 Unauthorized**: If the request does not include a valid authentication token
  ```json
  {
    "error": "Authorization header with JWT token is required"
  }
  ```

  OR

  ```json
  {
    "error": "Invalid token"
  }
  ```

- **500 Internal Server Error**: If there's a server-side error retrieving plant data

## Notes
- For `edible`, a plant that is edible wins over a plant that is not edible
- For `ph_range`, the plant with the higher value wins
- For all other stats, the plant with the lower value wins (year, light, soil_nutriments, atmospheric_humidity)
- If both plants have the same value for the compared statistic, the result is a draw 