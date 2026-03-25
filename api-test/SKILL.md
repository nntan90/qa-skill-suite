---
name: api-test
description: >
  Test REST and GraphQL APIs, database queries, and service contracts. Load when asked
  to test HTTP endpoints, validate response schemas, do contract testing, test authentication
  flows, test database interactions, or verify API error handling. Supports pytest+httpx,
  Jest+Supertest, RestAssured, Postman/Newman, Pact, and database testing (SQL, MongoDB).
  Includes field-level assertions, IDOR testing, rate limit testing, and mobile API patterns.
  Trigger phrases: "test the API", "API test", "HTTP test", "endpoint test", "contract test",
  "test the endpoint", "REST test", "GraphQL test", "Postman", "schema validation",
  "database test", "DB test", "RestAssured", "test service", "integration test API".
metadata:
  author: qa-skill-suite
  version: '3.0'
---

# API Test Skill
## REST · GraphQL · Database · Contract · Mobile API

## When to Use This Skill

- User has an API endpoint to test (REST or GraphQL)
- User wants schema/contract validation
- User wants to test auth flows, RBAC, IDOR
- User wants database-level testing
- User wants to test mobile backend APIs

---

## Agent Persona

**Act like a senior QA engineer with 20 years of experience.**

- Use plain, clear English. Short sentences. No robot language.
- Be direct. If something is wrong or missing, say it straight.
- Share real experience. Say things like: *"I've seen this miss bugs in production before"* or *"Most teams skip this, but it matters."*
- Always explain WHY a test matters, not just what to do.
- Point out risks even when the user didn't ask.

**Language standard:** Write all output in B1-level English. Simple words. Active voice. One idea per sentence.

---

## Output Review Loop

**After producing any output, the agent MUST run this self-check and include the result at the bottom.**

```
My Self-Check:
  [ ] Happy path — covered
  [ ] Error / failure cases — at least 2 covered
  [ ] Boundary values — covered (if numbers or ranges exist)
  [ ] Empty / null / zero inputs — covered
  [ ] Auth / permission — covered (if feature has login)
  [ ] Nothing obvious missing that a real user would try
  [ ] Output is complete — no "TODO" or "add more" placeholders

Verdict: COMPLETE / INCOMPLETE
If INCOMPLETE — what I still need to add: [list]
```

---
## Input Schema

**Collect ALL mandatory fields before generating tests. Ask if not provided.**

```yaml
INPUT REQUIRED:
  # --- Mandatory ---
  endpoint:               # HTTP method + path. e.g., "POST /api/users"
                          # Multiple endpoints: list all

  # --- Strongly Recommended ---
  request_spec:           # Describe the request:
                          # headers: [Authorization: Bearer, Content-Type: application/json]
                          # body fields: [{name, type, required, constraints}]
                          # path params: [{name, type}]
                          # query params: [{name, type, optional}]

  response_spec:          # Expected response(s):
                          # success: {status: 201, body_fields: [id, name, email, createdAt]}
                          # errors:  [{status: 422, when: "email missing"}, ...]

  auth_type:              # none | bearer_token | api_key | session_cookie | oauth2 | basic
                          # Default: bearer_token

  language:               # python | typescript | javascript | java | go | csharp
                          # Default: detect from context or python

  # --- Optional ---
  base_url:               # e.g., http://localhost:8000
                          # Default: http://localhost:8000

  user_roles:             # Roles to test RBAC with. e.g., [admin, user, guest]

  schema_definition:      # OpenAPI spec snippet OR JSON schema for response validation

  test_db:                # true | false — also verify DB state after mutations
                          # Default: false

  existing_tests:         # Paste existing test code to detect gaps

  special_scenarios:      # e.g., ["concurrent requests", "large payload", "unicode in name"]
```

---

## Output Contract

**ALL sections are mandatory. Never produce partial output.**

> *"A 200 OK test is the easy part. The real work is testing what happens when the token expires, the user doesn't own the resource, or the database is down. That's where production bugs live."*


### Section 1 — Endpoint Analysis
```
Endpoint:         [METHOD /path]
Auth:             [auth type]
Request body:     [fields with types + required flag]
Response (2xx):   [status + body shape]
Response (errors): [list of error codes + conditions]
Roles to test:    [list]
Schema provided:  yes | no (agent will infer if no)
```

### Section 2 — Test Matrix
One row per test case. Agent must cover ALL status codes.

| TC-ID | Method + Path | Scenario | Expected Status | Assertion Focus |
|---|---|---|---|---|
| API-[MOD]-[TYPE]-001 | POST /api/users | Valid payload | 201 | id present, schema valid |

**Mandatory status code coverage — generate test for EACH applicable code:**
| Code | Condition | Required? |
|---|---|---|
| 200/201 | Valid input, success | ✅ Always |
| 400 | Malformed request body | ✅ Always |
| 422 | Each required field missing | ✅ One per field |
| 422 | Wrong field type | ✅ One per typed field |
| 401 | No auth token | ✅ If auth required |
| 401 | Invalid/expired token | ✅ If auth required |
| 403 | Wrong role (RBAC) | ✅ If roles defined |
| 403 | IDOR (access other user's data) | ✅ If resource-scoped |
| 404 | Non-existent ID | ✅ If ID in path |
| 409 | Duplicate resource | ✅ If unique constraint |
| 429 | Rate limit exceeded | ⚠️ If rate limiting exists |
| 500 | Upstream failure (mocked) | ✅ Always |

### Section 3 — Test File (complete, runnable)
```[language]
# Full test file including:
# - imports + base config
# - auth fixture
# - ALL test cases from matrix above
# - schema definition for response validation
# - cleanup (delete test data in afterAll/teardown)
# - comments on IDOR + security cases
```

### Section 4 — Response Schema Definition
```json
// JSON Schema for each response type
// Validates: field presence, types, formats, enum values
// additionalProperties: false (no undocumented fields)
```

### Section 5 — Field-Level Assertion Checklist
For each response field:
```
[ ] id:        present, type string/uuid, not null
[ ] name:      present, type string, length >= 1
[ ] email:     present, matches email regex
[ ] createdAt: present, ISO 8601 datetime format
[ ] password:  ABSENT (must not be in response)
[ ] [field]:   [assertion]
```

### Section 6 — Test Coverage Summary
```
Endpoints covered:      [N]
Total tests:            [N]
Happy path:             [N]
Error/validation:       [N]
Security (IDOR/auth):   [N]
DB-level verified:      [N] (if test_db=true)
Gaps:                   [list any uncovered scenarios + reason]
```

---

## Workflow

1. **Map the API** — method, URL, auth, request body, expected responses
2. **Classify tests** — functional, security, performance, contract
3. **Choose framework** — from stack table
4. **Generate test code** — runnable, with all auth/headers
5. **Add schema validation** — every response must be validated structurally
6. **Add security checks** — IDOR, auth bypass, injection (basic)
7. **Run checklist** — per-endpoint completion gate

## Framework Selection

| Stack | Framework | Notes |
|---|---|---|
| Python | pytest + httpx | Async-native, clean |
| Node/TS (in-process) | Jest + Supertest | No real server needed |
| Node/TS (external) | axios + Jest | Real server |
| Java | RestAssured | Fluent DSL |
| Go | net/http/httptest | Zero deps, built-in |
| C# | RestSharp + xUnit | Clean .NET |
| Ruby | RSpec + Faraday | Idiomatic Ruby |
| Any (collections) | Postman + Newman | GUI + CLI |

## Test Pattern Library

### Pattern 1: Basic Status Code + Schema (Python/httpx)

```python
import pytest
import httpx
from jsonschema import validate

BASE_URL = "http://localhost:8000"
USER_SCHEMA = {
    "type": "object",
    "required": ["id", "name", "email", "createdAt"],
    "properties": {
        "id":        {"type": "string"},
        "name":      {"type": "string", "minLength": 1},
        "email":     {"type": "string", "format": "email"},
        "createdAt": {"type": "string", "format": "date-time"},
        "role":      {"type": "string", "enum": ["user", "admin"]}
    },
    "additionalProperties": False  # no extra fields allowed
}

@pytest.fixture
def client():
    return httpx.Client(base_url=BASE_URL)

class TestGetUser:
    def test_returns_200_for_existing_user(self, client, auth_header):
        r = client.get("/api/users/user-123", headers=auth_header)
        assert r.status_code == 200

    def test_response_matches_schema(self, client, auth_header):
        r = client.get("/api/users/user-123", headers=auth_header)
        validate(instance=r.json(), schema=USER_SCHEMA)  # raises if invalid

    def test_all_required_fields_present(self, client, auth_header):
        r = client.get("/api/users/user-123", headers=auth_header)
        body = r.json()
        assert all(k in body for k in ["id", "name", "email", "createdAt"])

    def test_no_sensitive_fields_in_response(self, client, auth_header):
        r = client.get("/api/users/user-123", headers=auth_header)
        body = r.json()
        assert "password" not in body
        assert "passwordHash" not in body
        assert "internalId" not in body
```

### Pattern 2: Full CRUD (TypeScript/Supertest)

```typescript
import request from 'supertest';
import { app }  from '../app';
import { db }   from '../db';

describe('Users CRUD', () => {
  let token: string;
  let createdUserId: string;

  beforeAll(async () => {
    // Get auth token
    const res = await request(app).post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'test-password' });
    token = res.body.access_token;
  });

  afterAll(async () => {
    // Clean up test data
    if (createdUserId) await db.users.delete(createdUserId);
  });

  describe('POST /api/users — Create', () => {
    it('creates user with valid data → 201', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test User', email: `test+${Date.now()}@example.com` });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ name: 'Test User' });
      expect(res.body.id).toBeDefined();
      createdUserId = res.body.id;
    });

    it('returns 422 when email is missing', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'No Email' });
      expect(res.status).toBe(422);
      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: 'email' })
      );
    });

    it('returns 409 for duplicate email', async () => {
      const email = `dup+${Date.now()}@example.com`;
      await request(app).post('/api/users').set('Authorization', `Bearer ${token}`)
        .send({ name: 'First', email });
      const res = await request(app).post('/api/users').set('Authorization', `Bearer ${token}`)
        .send({ name: 'Second', email });
      expect(res.status).toBe(409);
    });
  });

  describe('GET /api/users/:id — Read', () => {
    it('returns 404 for non-existent id', async () => {
      const res = await request(app)
        .get('/api/users/non-existent-999')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });
  });
});
```

### Pattern 3: Auth & RBAC Tests

```python
class TestAuthorization:
    """Test authentication and role-based access control"""

    def test_no_token_returns_401(self, client):
        assert client.get("/api/profile").status_code == 401

    def test_invalid_token_returns_401(self, client):
        r = client.get("/api/profile",
            headers={"Authorization": "Bearer invalid.token.here"})
        assert r.status_code == 401

    def test_expired_token_returns_401(self, client, expired_token):
        r = client.get("/api/profile",
            headers={"Authorization": f"Bearer {expired_token}"})
        assert r.status_code == 401

    def test_regular_user_cannot_access_admin_endpoint(self, client, user_token):
        r = client.delete("/api/admin/users/any-id",
            headers={"Authorization": f"Bearer {user_token}"})
        assert r.status_code == 403

    def test_idor_user_cannot_access_other_users_data(self, client):
        """IDOR: User A cannot read User B's profile"""
        token_a = login("user_a@example.com", "password")
        token_b = login("user_b@example.com", "password")

        # Get User B's ID
        user_b_id = get_user_id("user_b@example.com")

        # Try to access User B's data as User A
        r = client.get(f"/api/users/{user_b_id}/private-data",
            headers={"Authorization": f"Bearer {token_a}"})
        assert r.status_code == 403, "IDOR: User A accessed User B's data!"
```

### Pattern 4: GraphQL Tests

```python
def test_graphql_user_query_returns_data(client, auth_header):
    query = """
    query GetUser($id: ID!) {
        user(id: $id) { id  name  email }
    }
    """
    r = client.post("/graphql",
        json={"query": query, "variables": {"id": "user-123"}},
        headers=auth_header)
    assert r.status_code == 200
    body = r.json()
    assert "errors" not in body, f"GraphQL errors: {body.get('errors')}"
    assert body["data"]["user"]["id"] == "user-123"

def test_graphql_returns_error_for_unknown_field(client, auth_header):
    r = client.post("/graphql",
        json={"query": "{ unknownField }"},
        headers=auth_header)
    assert r.status_code == 200
    assert "errors" in r.json()
```

### Pattern 5: Database Testing (SQL with pytest)

```python
from sqlalchemy import text

def test_user_created_in_database(db_session, client, auth_header):
    """Verify API write actually persists to DB correctly"""
    email = f"dbtest+{uuid4()}@example.com"

    # Act via API
    r = client.post("/api/users",
        json={"name": "DB Test User", "email": email},
        headers=auth_header)
    assert r.status_code == 201
    user_id = r.json()["id"]

    # Verify directly in DB
    result = db_session.execute(
        text("SELECT id, name, email FROM users WHERE id = :id"),
        {"id": user_id}
    ).fetchone()

    assert result is not None
    assert result.email == email
    assert result.name  == "DB Test User"

def test_password_stored_as_hash_not_plaintext(db_session, client):
    """Security: passwords must never be stored in plaintext"""
    email = f"sec+{uuid4()}@example.com"
    client.post("/api/users",
        json={"email": email, "password": "MySecret123!"})

    result = db_session.execute(
        text("SELECT password, password_hash FROM users WHERE email = :e"),
        {"e": email}
    ).fetchone()

    if hasattr(result, 'password'):
        assert result.password != "MySecret123!", "Password stored in plaintext!"
    assert result.password_hash.startswith("$2b$") or \
           result.password_hash.startswith("$argon2"), "Not using bcrypt/argon2"
```

### Pattern 6: Mobile API Patterns (thin client simulation)

```python
# Simulate mobile client behavior
MOBILE_HEADERS = {
    "User-Agent": "MyApp/2.3.1 (iPhone; iOS 17.2; Scale/3.00)",
    "X-App-Version": "2.3.1",
    "X-Platform": "ios",
    "Accept-Language": "en-US,en;q=0.9",
}

def test_api_works_with_mobile_client_headers(client):
    r = client.get("/api/feed", headers={**MOBILE_HEADERS,
        "Authorization": f"Bearer {get_token()}"})
    assert r.status_code == 200

def test_outdated_app_version_returns_426(client):
    """Server should tell old app versions to upgrade"""
    r = client.get("/api/feed", headers={
        **MOBILE_HEADERS,
        "X-App-Version": "1.0.0",  # very old
        "Authorization": f"Bearer {get_token()}"
    })
    assert r.status_code in [200, 426]  # 426 = Upgrade Required
```

### Pattern 7: Pagination & List Endpoints

```python
class TestPagination:
    def test_default_page_returns_first_20(self, client, auth_header):
        r = client.get("/api/users", headers=auth_header)
        body = r.json()
        assert len(body["items"]) <= 20
        assert "total" in body
        assert "page"  in body
        assert "limit" in body

    def test_page_2_returns_different_items(self, client, auth_header):
        page1 = client.get("/api/users?page=1&limit=5", headers=auth_header).json()
        page2 = client.get("/api/users?page=2&limit=5", headers=auth_header).json()
        ids_p1 = {u["id"] for u in page1["items"]}
        ids_p2 = {u["id"] for u in page2["items"]}
        assert ids_p1.isdisjoint(ids_p2), "Pages contain overlapping items"

    def test_empty_results_returns_empty_list_not_404(self, client, auth_header):
        r = client.get("/api/users?role=nonexistent_role", headers=auth_header)
        assert r.status_code == 200
        assert r.json()["items"] == []
```

### Pattern 8: RestAssured (Java)

```java
import io.restassured.RestAssured;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class UserApiTest {

    @BeforeAll
    static void setup() {
        RestAssured.baseURI = "http://localhost:8080";
    }

    @Test
    void getUser_withValidId_returns200WithCorrectSchema() {
        given()
            .header("Authorization", "Bearer " + getToken())
        .when()
            .get("/api/users/{id}", "user-123")
        .then()
            .statusCode(200)
            .body("id",    notNullValue())
            .body("name",  not(emptyString()))
            .body("email", matchesRegex(".*@.*\\..*"))
            .body("$",     not(hasKey("password")));   // no password in response
    }

    @Test
    void createUser_withMissingEmail_returns422() {
        given()
            .header("Authorization", "Bearer " + getToken())
            .contentType("application/json")
            .body("""{"name": "No Email User"}""")
        .when()
            .post("/api/users")
        .then()
            .statusCode(422)
            .body("errors.field", hasItem("email"));
    }
}
```

## API Test Checklist (Per Endpoint)

```
Status Codes:
[ ] 2xx success — valid input
[ ] 400/422 — missing required fields
[ ] 400/422 — wrong field format/type
[ ] 401 — missing token
[ ] 401 — invalid/expired token
[ ] 403 — valid token, wrong role
[ ] 404 — resource not found
[ ] 409 — duplicate resource
[ ] 429 — rate limiting hit
[ ] 500 — upstream failure (mock it)

Response Body:
[ ] Schema validated (all fields, types, formats)
[ ] No sensitive data exposed (password, token, SSN, etc.)
[ ] Pagination meta present (list endpoints)
[ ] Error body has useful message (not generic "error")

Security:
[ ] IDOR tested (cannot access other users' resources)
[ ] XSS payload in string fields does not execute
[ ] SQL injection attempt rejected
[ ] Rate limiting active on sensitive endpoints
```

---

## Output Review — How to Review Agent's Work

**You can paste the agent's output back and ask for a review.**

Use this prompt:
```
Review this output. Act like a senior QA manager with 20 years of experience.
Tell me:
  1. What test scenarios did you miss?
  2. What is the biggest risk we are NOT testing?
  3. Is this output complete enough to ship? Yes or No, and why.

[paste the output here]
```

The agent will then re-check its own work and give you an honest gap report.

---

## References

- `references/httpx-guide.md` — async client, session, auth
- `references/supertest-guide.md` — with Express/Fastify/NestJS
- `references/restassured-guide.md` — RestAssured with Spring Boot
- `references/pact-guide.md` — Consumer-Driven Contract Testing
- `assets/templates/api-test-checklist.md` — per-endpoint checklist
- `assets/templates/postman-collection-template.json` — base collection
