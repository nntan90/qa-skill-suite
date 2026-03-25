# Framework Folder Structure Templates

## TypeScript + Playwright

```
my-framework/
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── config/
│   ├── settings.ts
│   └── environments/
│       ├── staging.env
│       └── production.env
├── src/
│   ├── pages/
│   ├── api/
│   ├── components/
│   └── utils/
│       ├── dataFactory.ts
│       ├── dataLoader.ts
│       └── apiHelper.ts
├── tests/
│   ├── smoke/
│   ├── regression/
│   │   ├── auth/
│   │   ├── checkout/
│   │   └── api/
│   └── e2e/
├── fixtures/
│   ├── auth.fixture.ts
│   └── database.fixture.ts
├── test-data/
│   ├── users.json
│   └── products.json
└── .github/workflows/
    ├── smoke.yml
    ├── regression.yml
    └── nightly.yml
```

## Python + pytest

```
my-framework/
├── pytest.ini
├── requirements.txt
├── config/
│   ├── config.py
│   └── environments/
├── src/
│   ├── api/
│   │   ├── base_client.py
│   │   └── auth_client.py
│   ├── pages/
│   └── utils/
│       ├── data_factory.py
│       └── db_helper.py
├── tests/
│   ├── conftest.py
│   ├── smoke/
│   ├── api/
│   └── e2e/
└── test_data/
```

## Java + Selenium + TestNG

```
my-framework/
├── pom.xml
├── testng.xml
├── src/
│   ├── main/java/
│   │   ├── config/ConfigManager.java
│   │   ├── drivers/DriverManager.java
│   │   ├── pages/
│   │   │   ├── BasePage.java
│   │   │   └── LoginPage.java
│   │   ├── api/BaseApiClient.java
│   │   └── utils/
│   │       ├── DataFactory.java
│   │       └── WaitHelper.java
│   └── test/java/
│       ├── smoke/
│       ├── regression/
│       └── api/
└── test-data/
    └── users.json
```
