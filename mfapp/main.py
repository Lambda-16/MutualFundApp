from fastapi import FastAPI
from routers.login.user import router as user_router
from routers.mutualfund.mutualfund import router as mf_router
from routers.mutualfund.investment import router as invest_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router, prefix="/user")
app.include_router(mf_router, prefix="/mfdata")
app.include_router(invest_router, prefix="/investment")




