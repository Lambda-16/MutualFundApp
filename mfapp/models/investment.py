from pydantic import BaseModel
from models.mutualfund import BasicSchemeInfo

class BuyMutualFundIn(BaseModel):
    units: int
    scheme_code: int
    current_nav: float
    scheme_name: str

class InvestedSchemeInfo(BasicSchemeInfo):
    units: int
    invested: float

class InvestedSchemeInfoWithCurrentValue(InvestedSchemeInfo):
    current_value: float

