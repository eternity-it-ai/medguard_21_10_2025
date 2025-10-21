import google.generativeai as genai
from dotenv import load_dotenv
from os import environ
load_dotenv()

class GeminiModel:
    GEMINI_API_KEY = environ.get("GEMINI_KEY")

    def __init__(self, model_name: str = 'gemini-2.0-flash'):
        self.model_name = model_name
        self.model = None

    def configure(self):
        genai.configure(api_key=self.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(self.model_name)

    def get_model(self):
        if not self.model:
            raise ValueError("Model is not configured. Call configure(api_key) first.")
        return self.model

    def generate_content(self, prompt):
        if not self.model:
            raise ValueError("Model is not configured. Call configure() first.")
        return self.model.generate_content(prompt)


gemini_model = GeminiModel()
gemini_model.configure()