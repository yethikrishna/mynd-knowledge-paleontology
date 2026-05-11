# API Documentation

## Base URL

```
http://localhost/api/v1
```

## Authentication

### JWT Authentication

Most endpoints require a valid JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### API Key Authentication

For programmatic access, use API keys:

```
X-API-Key: <your-api-key>
```

## Endpoints

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "organizationName": "My Company"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Refresh Token
```http
POST /auth/refresh
Cookie: refresh_token=<refresh-token>
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

---

### Knowledge Fossils

#### Create Fossil
```http
POST /fossils
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Knowledge distillation techniques...",
  "sourceType": "model",
  "sourceId": "model-v1.0",
  "metadata": {
    "modelVersion": "1.0",
    "trainingStep": 42000
  }
}
```

**Response:**
```json
{
  "id": "fossil-001",
  "hash": "a1b2c3d4e5f6...",
  "merkleRoot": "0x7f83b165...",
  "depth": 7.2,
  "timestamp": "2024-04-15T10:30:00Z"
}
```

#### Get Fossil
```http
GET /fossils/:id
Authorization: Bearer <token>
```

#### Get Fossil Content
```http
GET /fossils/:id/content
Authorization: Bearer <token>
```

#### Get Merkle Proof
```http
GET /fossils/:id/proof
Authorization: Bearer <token>
```

#### Verify Fossil
```http
POST /fossils/:id/verify
Authorization: Bearer <token>
```

#### List Fossils
```http
GET /fossils?page=1&limit=20&sourceType=model
Authorization: Bearer <token>
```

#### Get Statistics
```http
GET /fossils/stats
Authorization: Bearer <token>
```

---

### Provenance

#### Get Provenance Chain
```http
GET /provenance/:knowledgeId
Authorization: Bearer <token>
```

#### Get Provenance Graph
```http
GET /provenance/:knowledgeId/graph
Authorization: Bearer <token>
```

#### Verify Chain
```http
POST /provenance/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "chainId": "chain-001"
}
```

---

### Knowledge Network

#### Get Diffusion Graph
```http
GET /network/diffusion
Authorization: Bearer <token>
```

**Response:** Sigma.js compatible graph data

#### Get Network Metrics
```http
GET /network/metrics
Authorization: Bearer <token>
```

**Response:**
```json
{
  "nodeCount": 156,
  "edgeCount": 423,
  "averageDegree": 5.42,
  "networkDensity": 0.035,
  "contaminationRate": 0.087
}
```

#### Get Animation Data
```http
GET /network/animate
Authorization: Bearer <token>
```

---

### Contamination Detection

#### Scan Contamination
```http
GET /contamination/scan?severity=high
Authorization: Bearer <token>
```

#### Get Fossil Contamination
```http
GET /contamination/:fossilId
Authorization: Bearer <token>
```

#### Get Heatmap Data
```http
GET /contamination/heatmap
Authorization: Bearer <token>
```

#### Remediate Contamination
```http
POST /contamination/remediate
Authorization: Bearer <token>
Content-Type: application/json

{
  "eventId": "event-001",
  "remediationType": "re-inject"
}
```

---

### First Occurrence Search

#### Search First Occurrence
```http
POST /search/first-occurrence
Authorization: Bearer <token>
Content-Type: application/json

{
  "query": "knowledge distillation techniques",
  "temporalRange": "all",
  "minConfidence": 0.7
}
```

#### Temporal Search
```http
GET /search/temporal/:query
Authorization: Bearer <token>
```

---

### Extinction Events

#### Get Extinction Timeline
```http
GET /extinction/timeline
Authorization: Bearer <token>
```

#### Get Recovery Recommendations
```http
GET /extinction/:eventId/recommendations
Authorization: Bearer <token>
```

---

### Organization

#### Get Organization Info
```http
GET /organization
Authorization: Bearer <token>
```

#### Get Members
```http
GET /organization/members
Authorization: Bearer <token>
```

---

### Billing

#### Get Subscription
```http
GET /billing/subscription
Authorization: Bearer <token>
```

#### Create Checkout Session
```http
POST /billing/create-checkout-session
Authorization: Bearer <token>
Content-Type: application/json

{
  "planId": "pro",
  "successUrl": "https://example.com/success",
  "cancelUrl": "https://example.com/cancel"
}
```

---

## Python Worker API

### Base URL
```
http://localhost/api/python
```

### Merkle Operations
```http
POST /merkle/generate
POST /merkle/verify
```

### Stratigraphy
```http
POST /stratigraphy/calculate
```

### Contamination
```http
POST /contamination/detect
```

### Search
```http
POST /search/first-occurrence
```

### Extinction
```http
POST /extinction/detect
```

### Network
```http
POST /network/build
```

### Provenance
```http
POST /provenance/build
```

### Batch Processing
```http
POST /batch/process
```

---

## Error Responses

### Standard Error Format
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "details": {}
  }
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - validation error |
| 401 | Unauthorized - invalid/missing token |
| 403 | Forbidden - insufficient permissions |
| 404 | Not Found |
| 409 | Conflict - resource already exists |
| 429 | Too Many Requests - rate limit exceeded |
| 500 | Internal Server Error |

---

## Rate Limiting

- **Authenticated requests**: 1000 requests/minute
- **Unauthenticated requests**: 60 requests/minute
- **API key requests**: Based on subscription tier

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1620000000
```
