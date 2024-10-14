from pydantic import BaseModel

class UserIn(BaseModel):
    email_id: str
    password: str
