from  pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_hostname: str
    database_port: str
    database_password: str
    database_name: str
    database_username: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    
    # AI/ML Configuration (Optional)
    hf_token: str = ""
    ai_text_model_name: str = ""
    ai_text_study_label: str = ""
    ai_text_non_study_label: str = ""
    ai_text_min_text_length: int = 3
    ai_text_max_text_length: int = 2000
    
    ai_image_model_name: str = ""
    ai_image_max_file_size_bytes: int = 10485760
    ai_image_top_k: int = 5
    ai_image_confidence_threshold: float = 0.45
    
    smart_search_model_name: str = ""
    smart_search_default_top_k: int = 5
    smart_search_max_top_k: int = 10
    smart_search_min_query_length: int = 3
    smart_search_min_similarity: float = 0.2
    smart_search_content_preview_length: int = 180
    smart_search_index_dir: str = ""
    smart_search_posts_path: str = ""
    smart_search_runtime_posts_path: str = ""
    
    class Config:
        env_file = ".env"

settings = Settings()