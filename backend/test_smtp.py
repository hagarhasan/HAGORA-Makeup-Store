import os
import smtplib
import ssl
from dotenv import load_dotenv

load_dotenv()

try:
    with smtplib.SMTP("smtp.gmail.com", 587, timeout=20) as server:
        server.set_debuglevel(1)
        server.starttls(context=ssl.create_default_context())
        server.login(
            os.getenv("MAIL_USERNAME"),
            os.getenv("MAIL_PASSWORD"),
        )
        print("SUCCESS: Gmail authentication worked!")

except Exception as error:
    print("FAILED:", type(error).__name__)
    print("Details:", str(error))