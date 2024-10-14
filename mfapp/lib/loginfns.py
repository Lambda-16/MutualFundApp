from jose import jwt, ExpiredSignatureError, JWTError
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer

import os
from dotenv import load_dotenv
load_dotenv()
ACCESS_TOKEN_TTL = int(os.getenv("ACCESS_TOKEN_TTL", default=30))
SECRET_KEY = os.getenv("SECRET_KEY")
user_table = {os.getenv("DUMMYUSERNAME"): os.getenv("DUMMYPASSWORD")}
oauth_scheme2 = OAuth2PasswordBearer(tokenUrl="login")

async def get_existing_user(email_id):
    return user_table.get(email_id)

#Password should be hashed first before saving to DB, will fix later
async def enter_new_user(user):
    user_table[user.email_id] = user.password

async def authenticate_user(email_id, password):
    registered_password = user_table.get(email_id)
    if registered_password == password:
        return
    raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail="Bad Credentials"
        )

async def create_access_token(email_id):
    expire = datetime.now(timezone(timedelta(hours = 5, minutes=30))) + timedelta(minutes = ACCESS_TOKEN_TTL)
    jwt_data = {"sub": email_id, "exp": expire}
    access_token = jwt.encode(jwt_data, key = SECRET_KEY)
    return access_token

async def get_user_from_token(token: str = Depends(oauth_scheme2)):
    try:
        jwt_data = jwt.decode(token, key = SECRET_KEY)
        email_id = jwt_data.get("sub")
        if not email_id or not await get_existing_user(email_id):
            raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail="Bad Credentials"
            )
    except ExpiredSignatureError:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except JWTError:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail="Bad Credentials"
        )
    return email_id



    