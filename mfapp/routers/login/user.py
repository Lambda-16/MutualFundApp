from fastapi import APIRouter, HTTPException, status
from models.user import UserIn
from lib.loginfns import get_existing_user, enter_new_user, authenticate_user, create_access_token


router  = APIRouter()

@router.post("/register", status_code=201)
async def register(user: UserIn):
    if await get_existing_user(user.email_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="A user with that email already exists")
    await enter_new_user(user)
    return {"detail": f"User created with email: {user.email_id}"}

@router.post("/login",  status_code=200)
async def login(user: UserIn):
    await authenticate_user(user.email_id, user.password)    
    access_token = await create_access_token(user.email_id)
    return {"access_token": access_token, "token_type": "bearer"}
    
