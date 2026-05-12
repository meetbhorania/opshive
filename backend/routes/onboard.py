from fastapi import APIRouter
from pydantic import BaseModel
import google.generativeai as genai
import os, json
from dotenv import load_dotenv
from context.context_layer import mcp_context

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

router = APIRouter()
model = genai.GenerativeModel("gemini-2.5-flash")

class CompanyProfile(BaseModel):
    name: str
    industry: str
    team_size: str
    goal: str

@router.post("/onboard")
async def onboard_company(profile: CompanyProfile):
    prompt = f"""You are generating realistic mock operational data for a startup called {profile.name}.

Company details:
- Industry: {profile.industry}
- Team size: {profile.team_size}
- What they're building: {profile.goal}

Generate a realistic JSON scenario for this company that shows a Monday morning operational crisis. The scenario must feel specific and real for this type of company.

Return ONLY valid JSON with this exact structure:
{{
  "company": "{profile.name}",
  "industry": "{profile.industry}",
  "team_size": {profile.team_size.split('-')[0]},
  "crm": {{
    "leads": [
      {{"name": "realistic company name", "value": realistic_number, "last_contact_days": number_3_to_7, "status": "negotiation or proposal"}},
      {{"name": "another realistic company", "value": realistic_number, "last_contact_days": number_1_to_2, "status": "qualified"}}
    ],
    "pipeline_total": realistic_number,
    "pipeline_change_pct": negative_number_between_minus_5_and_minus_25
  }},
  "finance": {{
    "overdue_invoices": [
      {{"client": "realistic client name", "amount": realistic_amount, "days_overdue": number_7_to_21}},
      {{"client": "another client", "amount": realistic_amount, "days_overdue": number_5_to_14}},
      {{"client": "third client", "amount": realistic_amount, "days_overdue": number_14_to_30}}
    ],
    "total_exposure": sum_of_above,
    "monthly_burn": realistic_burn_for_team_size,
    "runway_months": number_between_3_and_6
  }},
  "support": {{
    "ticket_volume_change_pct": number_between_200_and_400,
    "open_tickets": number_between_20_and_80,
    "top_complaint": "specific complaint relevant to their product/industry",
    "sla_breaches": number_between_2_and_8,
    "avg_response_time_hrs": number_between_4_and_12
  }},
  "marketing": {{
    "competitor": "realistic competitor name for their industry",
    "event": "price_cut or new_feature or new_product",
    "amount_pct": number_between_10_and_20,
    "hours_ago": number_between_1_and_6,
    "our_price": realistic_price,
    "their_new_price": lower_realistic_price
  }},
  "ops": {{
    "deadline_conflicts": [
      {{"engineers": ["Dev A", "Dev B"], "task": "specific task relevant to their product", "due": "tomorrow"}}
    ],
    "blocked_tasks": number_between_2_and_5,
    "team_capacity_pct": number_between_88_and_98
  }}
}}

Make all names, numbers and complaints specific and realistic for a {profile.industry} company called {profile.name}. No generic placeholders."""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        text = text.replace('```json', '').replace('```', '').strip()
        scenario = json.loads(text)
        mcp_context.set("scenario", scenario)
        mcp_context._context["scenario"] = scenario
        return {"status": "ok", "scenario": scenario}
    except Exception as e:
        print(f"Onboard error: {e}")
        return {"status": "fallback", "scenario": mcp_context.get_scenario()}