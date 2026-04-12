"""
HTTPX API Test Starter Template
================================
A production-ready API test file template using httpx and pytest.
Replace [API] with your actual API name.

Usage:
  pytest tests/test_api_[endpoint].py -v
  pytest tests/test_api_[endpoint].py -v --tb=short -x
"""

import pytest
import httpx
from typing import Any

# =============================================================================
# CONFIGURATION
# =============================================================================

BASE_URL = "https://api.example.com"
API_VERSION = "v1"

# Test credentials (use environment variables in production)
TEST_USER_EMAIL = "test@example.com"
TEST_USER_PASSWORD = "test123"


# =============================================================================
# FIXTURES
# =============================================================================

@pytest.fixture(scope="session")
def api_client() -> httpx.Client:
    """Create a shared API client for all tests."""
    client = httpx.Client(
        base_url=f"{BASE_URL}/{API_VERSION}",
        timeout=30.0,
        headers={"Content-Type": "application/json"},
    )
    yield client
    client.close()


@pytest.fixture(scope="session")
def auth_token(api_client: httpx.Client) -> str:
    """Get authentication token for protected endpoints."""
    response = api_client.post(
        "/auth/login",
        json={"email": TEST_USER_EMAIL, "password": TEST_USER_PASSWORD},
    )
    assert response.status_code == 200
    return response.json()["token"]


@pytest.fixture
def auth_headers(auth_token: str) -> dict[str, str]:
    """Headers with authentication token."""
    return {"Authorization": f"Bearer {auth_token}"}


@pytest.fixture
def sample_resource() -> dict[str, Any]:
    """Sample resource data for testing."""
    return {
        "name": "Test Resource",
        "description": "Created by automated test",
        "status": "active",
    }


# =============================================================================
# HAPPY PATH TESTS
# =============================================================================

class TestResourceCRUD:
    """Test CRUD operations on /resources endpoint."""

    def test_create_resource_returns_201(
        self, api_client: httpx.Client, auth_headers: dict, sample_resource: dict
    ):
        """
        GIVEN valid resource data
        WHEN POST /resources
        THEN returns 201 Created with resource data
        """
        response = api_client.post(
            "/resources",
            json=sample_resource,
            headers=auth_headers,
        )

        assert response.status_code == 201
        data = response.json()
        assert "id" in data
        assert data["name"] == sample_resource["name"]

    def test_get_resource_by_id_returns_200(
        self, api_client: httpx.Client, auth_headers: dict
    ):
        """
        GIVEN an existing resource ID
        WHEN GET /resources/{id}
        THEN returns 200 OK with resource data
        """
        resource_id = 1  # Replace with actual ID or use fixture

        response = api_client.get(
            f"/resources/{resource_id}",
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == resource_id

    def test_list_resources_returns_paginated_results(
        self, api_client: httpx.Client, auth_headers: dict
    ):
        """
        GIVEN resources exist
        WHEN GET /resources with pagination
        THEN returns paginated list
        """
        response = api_client.get(
            "/resources",
            params={"page": 1, "limit": 10},
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert len(data["items"]) <= 10

    def test_update_resource_returns_200(
        self, api_client: httpx.Client, auth_headers: dict
    ):
        """
        GIVEN an existing resource
        WHEN PATCH /resources/{id} with updates
        THEN returns 200 OK with updated data
        """
        resource_id = 1
        updates = {"name": "Updated Name"}

        response = api_client.patch(
            f"/resources/{resource_id}",
            json=updates,
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["name"] == updates["name"]

    def test_delete_resource_returns_204(
        self, api_client: httpx.Client, auth_headers: dict
    ):
        """
        GIVEN an existing resource
        WHEN DELETE /resources/{id}
        THEN returns 204 No Content
        """
        resource_id = 1

        response = api_client.delete(
            f"/resources/{resource_id}",
            headers=auth_headers,
        )

        assert response.status_code == 204


# =============================================================================
# ERROR RESPONSE TESTS
# =============================================================================

class TestResourceErrors:
    """Test error responses from /resources endpoint."""

    def test_create_without_auth_returns_401(
        self, api_client: httpx.Client, sample_resource: dict
    ):
        """
        GIVEN no authentication
        WHEN POST /resources
        THEN returns 401 Unauthorized
        """
        response = api_client.post("/resources", json=sample_resource)

        assert response.status_code == 401
        assert "error" in response.json()

    def test_create_with_invalid_data_returns_422(
        self, api_client: httpx.Client, auth_headers: dict
    ):
        """
        GIVEN invalid resource data
        WHEN POST /resources
        THEN returns 422 Unprocessable Entity
        """
        invalid_data = {"name": ""}  # Empty required field

        response = api_client.post(
            "/resources",
            json=invalid_data,
            headers=auth_headers,
        )

        assert response.status_code == 422
        errors = response.json()
        assert "errors" in errors or "detail" in errors

    def test_get_nonexistent_resource_returns_404(
        self, api_client: httpx.Client, auth_headers: dict
    ):
        """
        GIVEN a non-existent resource ID
        WHEN GET /resources/{id}
        THEN returns 404 Not Found
        """
        response = api_client.get(
            "/resources/999999",
            headers=auth_headers,
        )

        assert response.status_code == 404

    def test_update_with_invalid_id_returns_400(
        self, api_client: httpx.Client, auth_headers: dict
    ):
        """
        GIVEN an invalid resource ID format
        WHEN PATCH /resources/{id}
        THEN returns 400 Bad Request
        """
        response = api_client.patch(
            "/resources/invalid-id",
            json={"name": "Test"},
            headers=auth_headers,
        )

        assert response.status_code == 400


# =============================================================================
# AUTHENTICATION TESTS
# =============================================================================

class TestAuthentication:
    """Test authentication endpoints."""

    def test_login_with_valid_credentials_returns_token(
        self, api_client: httpx.Client
    ):
        """
        GIVEN valid credentials
        WHEN POST /auth/login
        THEN returns 200 with token
        """
        response = api_client.post(
            "/auth/login",
            json={
                "email": TEST_USER_EMAIL,
                "password": TEST_USER_PASSWORD,
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert len(data["token"]) > 0

    def test_login_with_invalid_password_returns_401(
        self, api_client: httpx.Client
    ):
        """
        GIVEN invalid password
        WHEN POST /auth/login
        THEN returns 401 Unauthorized
        """
        response = api_client.post(
            "/auth/login",
            json={
                "email": TEST_USER_EMAIL,
                "password": "wrong-password",
            },
        )

        assert response.status_code == 401

    def test_expired_token_returns_401(self, api_client: httpx.Client):
        """
        GIVEN an expired token
        WHEN accessing protected endpoint
        THEN returns 401 Unauthorized
        """
        expired_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.expired"

        response = api_client.get(
            "/resources",
            headers={"Authorization": f"Bearer {expired_token}"},
        )

        assert response.status_code == 401


# =============================================================================
# SCHEMA VALIDATION TESTS
# =============================================================================

class TestResponseSchema:
    """Validate response schema structure."""

    def test_resource_response_has_required_fields(
        self, api_client: httpx.Client, auth_headers: dict
    ):
        """
        GIVEN a resource request
        WHEN GET /resources/{id}
        THEN response contains all required fields
        """
        response = api_client.get("/resources/1", headers=auth_headers)

        if response.status_code == 200:
            data = response.json()
            required_fields = ["id", "name", "created_at", "updated_at"]
            for field in required_fields:
                assert field in data, f"Missing required field: {field}"

    def test_error_response_has_standard_format(
        self, api_client: httpx.Client
    ):
        """
        GIVEN an error condition
        WHEN API returns error
        THEN error has standard format
        """
        response = api_client.get("/resources/999999")

        if response.status_code >= 400:
            data = response.json()
            # Check for standard error structure
            assert "error" in data or "message" in data or "detail" in data


# =============================================================================
# RUN CONFIGURATION
# =============================================================================

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
