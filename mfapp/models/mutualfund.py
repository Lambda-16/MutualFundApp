from pydantic import BaseModel

class BasicSchemeInfo(BaseModel):
    scheme_code: int
    scheme_name: str

class MutualFundInfo(BaseModel):
    Scheme_Code: int
    ISIN_Div_Payout_ISIN_Growth: str
    ISIN_Div_Reinvestment: str
    Scheme_Name : str
    Net_Asset_Value: float
    Date    : str
    Scheme_Type : str
    Scheme_Category : str
    Mutual_Fund_Family  : str