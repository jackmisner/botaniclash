# POST /tokens

## Description
This endpoint authenticates a user and returns a JWT token for use in subsequent requests.

---

## Request

### URL
`POST /tokens`

### Headers
None

### Body Parameters
| Field     | Type   | Description                          |
|-----------|--------|--------------------------------------|
| username  | string | **Required.** The username of the user. |
| password  | string | **Required.** The user's plain text password. |

#### Example
```json
{
    "username": "plantlover123",
    "password": "securepassword"
}
```

---

## Response

### Success (201 Created)
Returns a confirmation message and a newly generated JWT token.

#### Example
```json
{
    "message": "OK",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

| Field   | Type   | Description                                |
|---------|--------|--------------------------------------------|
| message | string | Confirmation message ("OK").              |
| token   | string | JWT token for authenticated requests.      |

---

### Error Responses

#### 400 Bad Request
Occurs if the request body is malformed.

##### Example
```json
{
    "message": "json: cannot unmarshal string into Go struct field ..."
}
```

#### 401 Unauthorized
Occurs if the password is incorrect.

##### Example
```json
{
    "message": "Password incorrect"
}
```

#### 500 Internal Server Error
Occurs if there is a server-side error while retrieving the user or generating the token.

##### Examples
```json
{
    "message": "record not found"
}
```
or
```json
{
    "message": "Error generating token"
}
```

---

## Notes
- The password is securely verified against the hashed password stored in the database.
- The JWT token returned should be included in the `Authorization` header as `Bearer {token}` for any protected endpoints.
- Ensure secure storage of the JWT token on the client side.