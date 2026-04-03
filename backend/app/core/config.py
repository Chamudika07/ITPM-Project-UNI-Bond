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
    ai_image_model_name: str = "MobileNet_V3_Large_Weights.DEFAULT"
    ai_image_max_file_size_bytes: int = 10 * 1024 * 1024
    ai_image_top_k: int = 5
    ai_image_confidence_threshold: float = 0.45

    class Config:
        env_file = ".env"


settings = Settings()
