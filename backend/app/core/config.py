from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_hostname: str
    database_port: str
    database_password: str
    database_name: str
    database_username: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int

    hf_token: str | None = None
    ai_text_model_name: str = "typeform/distilbert-base-uncased-mnli"
    ai_text_study_label: str = "study related academic discussion"
    ai_text_non_study_label: str = "non-study social, promotional, or irrelevant discussion"
    ai_text_min_text_length: int = 3
    ai_text_max_text_length: int = 2000

    class Config:
        env_file = ".env"


settings = Settings()
