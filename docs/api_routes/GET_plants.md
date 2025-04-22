# GET /plants

This endpoint retrieves a random selection of plant cards for the user.

## Request

### URL
```
GET /plants
```

### Required Headers
```
Authorization: "Bearer {jwt_token}"
```

## Response

### Success Response (200 OK)
Returns a JSON object containing an array of plant cards and a new JWT token.

```json
{
  "data": {
    "cards": [
      {
        "id": 1,
        "common_name": "European Silver Fir",
        "scientific_name": "Abies alba",
        "image_url": "https://example.com/plant1.jpg",
        "year": 1753,
        "observations": "Evergreen coniferous tree",
        "edible": false,
        "ph_levels": {
          "ph_minimum": 4,
          "ph_maximum": 7,
          "ph_range": 3,
          "ph_average": 5.5
        },
        "light": 6,
        "soil_nutriments": 5,
        "atmospheric_humidity": 7
      },
      // ... more plant cards
    ]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Each plant card contains the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | uint | Unique identifier for the plant |
| `common_name` | string | Common name of the plant |
| `scientific_name` | string | Scientific name of the plant |
| `image_url` | string | URL to an image of the plant |
| `year` | int | Year the plant was discovered/classified |
| `observations` | string | Additional observations about the plant |
| `edible` | boolean | Whether the plant is edible |
| `ph_levels` | object | Object containing pH level information |
| `light` | int | Light requirements (1-10 scale) |
| `soil_nutriments` | int | Soil nutrient requirements (1-10 scale) |
| `atmospheric_humidity` | int | Atmospheric humidity requirements (1-10 scale) |

The `token` field contains a new JWT token that should be used for subsequent authenticated requests.

### Error Responses

- **401 Unauthorized**: If the request does not have an `Authorization` header:
  ```json
  {
    "error": "Authorization header with JWT token is required"
  }
  ```

  OR if the token provided is not valid:

  ```json
  {
    "error": "Invalid token"
  }
  ```

- **500 Internal Server Error**: If there's a server-side error retrieving plant data

## Notes
- The endpoint returns up to 20 random plant cards.
- A new JWT token is generated for each successful request and should be used for subsequent requests. 