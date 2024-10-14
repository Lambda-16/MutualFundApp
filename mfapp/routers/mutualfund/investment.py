from fastapi import APIRouter, Depends

from models.investment import BuyMutualFundIn, InvestedSchemeInfo, InvestedSchemeInfoWithCurrentValue
from lib.loginfns import get_user_from_token

from lib.investmentfns import process_buy_request, get_portfolio, get_current_value

router  = APIRouter()

@router.post("/buyrequest")
async def buy_mutual_fund( buy_request :BuyMutualFundIn, email_id: str = Depends(get_user_from_token)):
    await process_buy_request(email_id, buy_request.model_dump())
    return {"detail": "Transaction Successful"}
    

@router.get("/viewportfolio", response_model=list[InvestedSchemeInfo])
async def get_portfolio_for_user(email_id: str = Depends(get_user_from_token)):
    return await get_portfolio(email_id)

@router.get("/getcurrentvalue", response_model=list[InvestedSchemeInfoWithCurrentValue])
async def get_current_value_for_user(email_id: str = Depends(get_user_from_token)):
    return await get_current_value(email_id)