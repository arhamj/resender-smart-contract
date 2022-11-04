from locust import HttpUser, task

class SimpleTokenTestPlan(HttpUser):
    @task
    def tx_details(self):
        self.client.get("/api/v1/address/0x0fd9596bF9D8Dbb70D746B2BB34cAE90A552cDE2/transactions")
