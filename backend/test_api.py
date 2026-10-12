import importlib
import os
import sys
import uuid
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

PROJECT_ROOT = Path(__file__).resolve().parent.parent
BACKEND_DIR = PROJECT_ROOT / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

TEST_DB_PATH = BACKEND_DIR / "test_api.db"
if TEST_DB_PATH.exists():
    TEST_DB_PATH.unlink()

os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB_PATH}"

for module_name in ["database", "models", "schemas", "security", "dependencies", "main"]:
    sys.modules.pop(module_name, None)

import database
import main

database.Base.metadata.create_all(bind=database.engine)

client = TestClient(main.app)


@pytest.fixture(autouse=True)
def reset_db():
    database.engine.dispose()
    if TEST_DB_PATH.exists():
        TEST_DB_PATH.unlink()
    database.Base.metadata.create_all(bind=database.engine)
    yield
    database.engine.dispose()
    if TEST_DB_PATH.exists():
        TEST_DB_PATH.unlink()


def unique_email(prefix: str):
    return f"{prefix}-{uuid.uuid4().hex[:8]}@test.com"


def register_user(email: str, password: str = "Password1!", first_name: str = "Test", last_name: str = "User"):
    response = client.post(
        "/register",
        json={
            "email": email,
            "password": password,
            "first_name": first_name,
            "last_name": last_name,
        },
    )
    assert response.status_code == 200, response.text
    payload = response.json()
    return payload, {"Authorization": f"Bearer {payload['access_token']}"}


def test_profile_name_and_username_flow():
    payload, headers = register_user(unique_email("profile"))

    response = client.put(
        "/me/name",
        json={"first_name": "  New  ", "last_name": " Name  "},
        headers=headers,
    )
    assert response.status_code == 200, response.text
    assert response.json()["user"]["first_name"] == "New"
    assert response.json()["user"]["last_name"] == "Name"

    username_response = client.put(
        "/me/username",
        json={"username": " newuser "},
        headers=headers,
    )
    assert username_response.status_code == 200, username_response.text
    assert username_response.json()["user"]["username"] == "newuser"

    second_response = client.put(
        "/me/username",
        json={"username": "lateruser"},
        headers=headers,
    )
    assert second_response.status_code == 409, second_response.text
    assert "60 days" in second_response.json()["detail"].lower()


def test_authenticated_password_change_requires_current_password():
    email = unique_email("password-change")
    _, headers = register_user(email)

    incorrect = client.put(
        "/me/password",
        json={"current_password": "WrongPassword1!", "new_password": "NewPassword2!"},
        headers=headers,
    )
    assert incorrect.status_code == 400
    assert incorrect.json()["detail"] == "Current password is incorrect"

    changed = client.put(
        "/me/password",
        json={"current_password": "Password1!", "new_password": "NewPassword2!"},
        headers=headers,
    )
    assert changed.status_code == 200, changed.text

    old_password_login = client.post(
        "/login",
        json={"email": email, "password": "Password1!"},
    )
    new_password_login = client.post(
        "/login",
        json={"email": email, "password": "NewPassword2!"},
    )
    assert old_password_login.status_code == 401
    assert new_password_login.status_code == 200, new_password_login.text


def test_notification_preferences_are_saved_per_user():
    _, headers = register_user(unique_email("notification-preferences"))

    initial = client.get("/me/notification-preferences", headers=headers)
    assert initial.status_code == 200
    assert initial.json()["preferences"] == {
        "orderUpdates": True,
        "promotions": False,
        "newsletter": False,
    }

    updated = client.put(
        "/me/notification-preferences",
        json={"orderUpdates": False, "promotions": True, "newsletter": True},
        headers=headers,
    )
    assert updated.status_code == 200, updated.text
    assert updated.json()["preferences"]["promotions"] is True

    reloaded = client.get("/me/notification-preferences", headers=headers)
    assert reloaded.json()["preferences"] == {
        "orderUpdates": False,
        "promotions": True,
        "newsletter": True,
    }


def test_profile_update_respects_username_lock_and_uniqueness():
    _, first_headers = register_user(unique_email("profile-lock-one"), first_name="One", last_name="User")
    _, second_headers = register_user(unique_email("profile-lock-two"), first_name="Two", last_name="User")

    first = client.put(
        "/me/profile",
        json={
            "username": "alphauser",
            "phone": "01012345678",
            "governorate": "cairo",
            "city": "Nasr City",
            "address": "123 Test Street",
        },
        headers=first_headers,
    )
    assert first.status_code == 200, first.text

    second = client.put(
        "/me/profile",
        json={
            "username": "alphauser",
            "phone": "01098765432",
            "governorate": "giza",
            "city": "Dokki",
            "address": "456 Another Street",
        },
        headers=second_headers,
    )
    assert second.status_code == 409, second.text
    assert "already taken" in second.json()["detail"].lower()

    repeat = client.put(
        "/me/profile",
        json={
            "username": "betauser",
            "phone": "01011111111",
            "governorate": "cairo",
            "city": "New Cairo",
            "address": "789 Third Street",
        },
        headers=first_headers,
    )
    assert repeat.status_code == 409, repeat.text
    assert "60 days" in repeat.json()["detail"].lower()


def test_profile_update_accepts_governorate_only():
    _, headers = register_user(unique_email("profile-partial"))

    response = client.put(
        "/me/profile",
        json={"governorate": "cairo"},
        headers=headers,
    )

    assert response.status_code == 200, response.text
    assert response.json()["user"]["governorate"] == "cairo"


def test_duplicate_username_is_rejected():
    _, first_headers = register_user(unique_email("dupone"), first_name="One", last_name="User")
    _, second_headers = register_user(unique_email("duptwo"), first_name="Two", last_name="User")

    first_response = client.put(
        "/me/username",
        json={"username": "sharedname"},
        headers=first_headers,
    )
    assert first_response.status_code == 200, first_response.text

    duplicate_response = client.put(
        "/me/username",
        json={"username": "sharedname"},
        headers=second_headers,
    )
    assert duplicate_response.status_code == 409, duplicate_response.text
    assert "already taken" in duplicate_response.json()["detail"].lower()


def test_governorates_and_shipping_config():
    response = client.get("/governorates")
    assert response.status_code == 200, response.text
    payload = response.json()
    assert len(payload["governorates"]) == 27
    assert any(item["code"] == "cairo" for item in payload["governorates"])
    assert payload["governorates"][0]["shipping_rate"] >= 0

    cairo = next(item for item in payload["governorates"] if item["code"] == "cairo")
    assert cairo["shipping_rate"] > 0


def test_products_endpoint_reads_remote_catalog(monkeypatch):
    class FakeResponse:
        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc_val, exc_tb):
            return False

        def read(self):
            return b'[{"id": 1, "name": "Lipstick", "brand": "Test Brand", "price": "12.50", "api_featured_image": "https://example.com/img.jpg"}]'

    monkeypatch.setattr(main.urllib.request, "urlopen", lambda *args, **kwargs: FakeResponse())

    response = client.get("/products")
    assert response.status_code == 200, response.text
    payload = response.json()
    assert payload[0]["name"] == "Lipstick"
    assert payload[0]["price"] == 12.5
    assert payload[0]["image_link"] == "https://example.com/img.jpg"


def test_order_creation_uses_backend_prices_and_user_scope():
    _, buyer_headers = register_user(unique_email("buyer"), first_name="Buyer", last_name="Person")
    _, other_headers = register_user(unique_email("other"), first_name="Other", last_name="User")

    order_payload = {
        "idempotency_key": "checkout-1",
        "governorate_code": "cairo",
        "city": "Nasr City",
        "address": "Building 12, Street 7, Fifth Settlement",
        "first_name": "Buyer",
        "last_name": "Person",
        "phone": "01012345678",
        "items": [
            {"product_id": 1, "quantity": 2, "price": 0.01},
            {"product_id": 2, "quantity": 1},
        ],
        "discount_code": "HAGORA20",
    }

    response = client.post("/orders", json=order_payload, headers=buyer_headers)
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["order"]["payment_method"] == "cod"
    assert data["order"]["payment_status"] == "unpaid"
    assert data["order"]["shipping_cost"] > 0
    assert data["order"]["total"] > 0
    first_item = data["order"]["items"][0]
    assert first_item["unit_price"] != 0.01
    assert first_item["line_total"] == first_item["unit_price"] * first_item["quantity"]

    list_response = client.get("/orders", headers=buyer_headers)
    assert list_response.status_code == 200, list_response.text
    assert len(list_response.json()["orders"]) >= 1

    order_id = data["order"]["id"]
    unauthorized = client.get(f"/orders/{order_id}", headers=other_headers)
    assert unauthorized.status_code == 404

    assert client.get("/orders").status_code in (401, 403)
    assert client.post("/orders", json=order_payload).status_code in (401, 403)

    invalid_quantity = {**order_payload, "items": [{"product_id": 1, "quantity": 0}]}
    assert client.post("/orders", json=invalid_quantity, headers=buyer_headers).status_code == 422

    invalid_product = {
        **order_payload,
        "idempotency_key": "invalid-product-check",
        "items": [{"product_id": 2147483647, "quantity": 1}],
    }
    assert client.post("/orders", json=invalid_product, headers=buyer_headers).status_code == 404


def test_development_account_endpoints_are_not_exposed():
    assert client.get("/dev/users").status_code == 404
    assert client.delete("/dev/users/someone@example.com").status_code == 404
