# pytest Cheatsheet

## Installation & Setup
```bash
pip install pytest pytest-mock pytest-asyncio pytest-cov httpx respx
```

## Running Tests
```bash
pytest                          # Run all tests
pytest tests/unit/              # Specific directory
pytest tests/unit/test_auth.py  # Specific file
pytest -k "test_login"          # Filter by name
pytest -v                       # Verbose output
pytest --cov=app --cov-report=html  # Coverage report
pytest -x                       # Stop on first failure
pytest --lf                     # Run only last failed
pytest -n auto                  # Parallel (pytest-xdist)
```

## Fixtures
```python
import pytest

# Function-scoped (default) — recreated for each test
@pytest.fixture
def user():
    return User(name="Alice", email="alice@example.com")

# Module-scoped — shared across all tests in the file
@pytest.fixture(scope="module")
def db_connection():
    conn = create_connection()
    yield conn
    conn.close()

# Session-scoped — shared across entire test run
@pytest.fixture(scope="session")
def app_config():
    return load_config("test")

# Autouse — automatically applied to all tests in scope
@pytest.fixture(autouse=True)
def reset_database():
    yield
    clear_all_tables()
```

## Markers
```python
@pytest.mark.parametrize("x,y,expected", [(1, 2, 3), (0, 0, 0)])
def test_add(x, y, expected):
    assert add(x, y) == expected

@pytest.mark.skip(reason="not implemented yet")
def test_feature():
    pass

@pytest.mark.skipif(sys.platform == "win32", reason="Linux only")
def test_linux_feature():
    pass

@pytest.mark.xfail(reason="known bug #123")
def test_known_failure():
    assert broken_function() == 1

# Custom markers (register in pytest.ini)
@pytest.mark.slow
def test_heavy_operation():
    pass
```

## Assertions
```python
assert result == expected
assert result != unexpected
assert result is None
assert result is not None
assert "substring" in result
assert len(result) == 3
assert result > 0
assert isinstance(result, dict)

# Exception assertion
with pytest.raises(ValueError):
    raise_value_error()

with pytest.raises(ValueError, match="must be positive"):
    validate(-1)

# Approx for floats
assert result == pytest.approx(3.14, rel=1e-3)
```

## Mocking (pytest-mock)
```python
def test_calls_service(mocker):
    mock = mocker.patch("app.services.email.send")
    mock.return_value = {"status": "sent"}

    result = notify_user("alice@example.com")

    mock.assert_called_once_with(to="alice@example.com")
    assert result["status"] == "sent"

# Spy (calls real function but records calls)
def test_spy(mocker):
    spy = mocker.spy(SomeClass, "some_method")
    instance = SomeClass()
    instance.some_method("arg")
    spy.assert_called_once_with("arg")

# Patch context manager
def test_with_context(mocker):
    with mocker.patch("time.sleep") as mock_sleep:
        slow_function()
        mock_sleep.assert_called()
```

## Async Tests (pytest-asyncio)
```python
import pytest
import pytest_asyncio

@pytest.mark.asyncio
async def test_async_fetch():
    result = await fetch_data("url")
    assert result is not None

# Async fixtures
@pytest_asyncio.fixture
async def async_client():
    async with httpx.AsyncClient(app=app, base_url="http://test") as client:
        yield client
```

## conftest.py Pattern
```python
# tests/conftest.py — shared fixtures for all tests
import pytest
from app import create_app
from app.db import get_db

@pytest.fixture(scope="session")
def app():
    app = create_app({"TESTING": True, "DATABASE_URL": "sqlite:///:memory:"})
    yield app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def db(app):
    with app.app_context():
        get_db().create_all()
        yield get_db()
        get_db().drop_all()
```
