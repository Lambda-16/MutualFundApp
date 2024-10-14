from fastapi import HTTPException, status
import requests
import os
from dotenv import load_dotenv
URL = "https://latest-mutual-fund-nav.p.rapidapi.com/latest"

load_dotenv()

async def get_mutual_fund_data(query_params = {}):

    query_params.update({"Scheme_Type":"Open"})

    headers = {
        "x-rapidapi-key": os.getenv("RAPID_API_KEY"),
        "x-rapidapi-host": "latest-mutual-fund-nav.p.rapidapi.com"
    }
    try:
        response = requests.get(URL, headers=headers, params=query_params)
    except Exception as ex: 
        raise HTTPException(
                status_code = status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(ex)
            )

    return response.json()


async def all_fund_families():
    
    listOfMutualFunds = await get_mutual_fund_data()
    print(listOfMutualFunds)
    return list(set(i["Mutual_Fund_Family"] for i in listOfMutualFunds))

async def open_schemes_for_fund_family(fund_family):
    query_params = {"Mutual_Fund_Family": fund_family}
    listOfMutualFunds = await get_mutual_fund_data(query_params)
    return [{"scheme_code": i["Scheme_Code"], "scheme_name": i["Scheme_Name"]} for i in listOfMutualFunds]
#Needs a fix to handle multiple scheme codes in one api request
async def mutual_fund_info(scheme_code):
    query_params = {"Scheme_Code": str(scheme_code)}
    fund_info =  await get_mutual_fund_data(query_params)
    return fund_info[0]