from fastapi import APIRouter, Depends

from models.mutualfund import  BasicSchemeInfo, MutualFundInfo
from lib.mutualfundfns import all_fund_families, open_schemes_for_fund_family, mutual_fund_info
from lib.loginfns import get_user_from_token

router  = APIRouter()

@router.get("/fetchfamilies", response_model=list[str])
async def fetch_mutual_fund_families(email_id: str = Depends(get_user_from_token)):
    #return ["Kotak Mahindra Mutual Fund", "Mirae Asset Mutual Fund"]
    return await all_fund_families()

@router.get("/getopenschemes/{mutual_fund_family}", response_model=list[BasicSchemeInfo])
async def get_open_schemes_for_fund_family(mutual_fund_family:str, email_id: str = Depends(get_user_from_token)):
    return await open_schemes_for_fund_family(mutual_fund_family)

@router.get("/fetchmutualfund/{scheme_code}", response_model=MutualFundInfo)
async def get_mutual_fund_info(scheme_code: int, email_id: str = Depends(get_user_from_token)):
    return await mutual_fund_info(scheme_code)