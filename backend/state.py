from agents.sales_agent import SalesAgent
from agents.finance_agent import FinanceAgent
from agents.domain_agents import MarketingAgent, SupportAgent, OpsAgent
from agents.ceo_agent import CEOAgent

agent_registry = {
    "sales": SalesAgent(),
    "finance": FinanceAgent(),
    "marketing": MarketingAgent(),
    "support": SupportAgent(),
    "ops": OpsAgent(),
    "ceo": CEOAgent(),
}
