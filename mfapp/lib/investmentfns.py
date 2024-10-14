from collections import defaultdict
from lib.mutualfundfns import mutual_fund_info
investment_table = defaultdict(list)

async def process_buy_request(email_id, request_data):
    investment_table[email_id].append(
        {"scheme_code": request_data["scheme_code"],
         "scheme_name": request_data["scheme_name"],
         "units": request_data["units"],
         "invested": request_data["current_nav"]*request_data["units"]})
    
async def get_portfolio(email_id):
    return investment_table[email_id]

async def get_current_value(email_id):
    investment_list = await get_portfolio(email_id)
    investment_list_with_current_value = []
    #Try to fetch current values for the scheme codes in one api call
    for investment in investment_list:
        investment.update({"current_value": await get_current_nav(investment["scheme_code"])*investment["units"]})
        investment_list_with_current_value.append(investment)

    return investment_list_with_current_value

async def get_current_nav(scheme_code):
    fund_info = await mutual_fund_info(scheme_code)
    return fund_info["Net_Asset_Value"]