import logging

from sqlalchemy import inspect, text

from database import engine

logger = logging.getLogger(__name__)


def run_migrations():
    inspector = inspect(engine)
    tables = inspector.get_table_names()

    if "users" not in tables:
        raise RuntimeError(
            "The users table does not exist. "
            "Create the database tables first."
        )

    with engine.begin() as connection:
        user_columns = {
            column["name"]
            for column in inspect(engine).get_columns("users")
        }

        if "governorate" not in user_columns:
            connection.execute(
                text("ALTER TABLE users ADD COLUMN governorate VARCHAR")
            )

        if "username_changed_at" not in user_columns:
            connection.execute(
                text(
                    "ALTER TABLE users "
                    "ADD COLUMN username_changed_at DATETIME"
                )
            )

        if "notification_preferences" not in user_columns:
            connection.execute(
                text(
                    "ALTER TABLE users "
                    "ADD COLUMN notification_preferences VARCHAR"
                )
            )

        # Emails are now stored in lowercase. Convert existing rows, but only if
        # that doesn't create duplicates (two accounts that differ only by case).
        collisions = connection.execute(
            text(
                "SELECT lower(email) FROM users "
                "GROUP BY lower(email) HAVING COUNT(*) > 1"
            )
        ).fetchall()

        if collisions:
            logger.warning(
                "Skipped lowercasing user emails: these emails exist more than "
                "once with different casing and must be merged manually: %s",
                [row[0] for row in collisions],
            )
        else:
            connection.execute(
                text(
                    "UPDATE users SET email = lower(email) "
                    "WHERE email != lower(email)"
                )
            )

        if "orders" in tables:
            order_columns = {
                column["name"]
                for column in inspect(engine).get_columns("orders")
            }

            for column_name, column_sql in {
                "payment_method": "VARCHAR DEFAULT 'cod'",
                "payment_status": "VARCHAR DEFAULT 'unpaid'",
                "idempotency_key": "VARCHAR",
            }.items():
                if column_name not in order_columns:
                    connection.execute(
                        text(
                            f"ALTER TABLE orders ADD COLUMN {column_name} {column_sql}"
                        )
                    )

            if "shipping_governorate_code" not in order_columns:
                connection.execute(
                    text(
                        "ALTER TABLE orders ADD COLUMN shipping_governorate_code VARCHAR"
                    )
                )

            if "shipping_governorate_name" not in order_columns:
                connection.execute(
                    text(
                        "ALTER TABLE orders ADD COLUMN shipping_governorate_name VARCHAR"
                    )
                )

            # Keep legacy rows compatible with older schemas that did not store COD metadata.
            connection.execute(
                text(
                    "UPDATE orders SET payment_method = COALESCE(payment_method, 'cod') "
                    "WHERE payment_method IS NULL"
                )
            )
            connection.execute(
                text(
                    "UPDATE orders SET payment_status = COALESCE(payment_status, 'unpaid') "
                    "WHERE payment_status IS NULL"
                )
            )
            connection.execute(
                text(
                    "UPDATE orders SET currency = COALESCE(currency, 'EGP') "
                    "WHERE currency IS NULL"
                )
            )