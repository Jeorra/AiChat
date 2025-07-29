from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

OLLAMA_URL = "http://localhost:11434/api/chat"


PROMPT_MD = ""
prompt_path = os.path.join(os.path.dirname(__file__), "prompt.json")
with open(prompt_path, "r", encoding="utf-8") as f:
    PROMPT_MD = f.read()

def is_pamukkale_related(message: str) -> bool:
    keywords = [
        "pamukkale üniversitesi", "pau", "pamukkale üni",
        "pamukkale", "denizli üniversitesi", "pau öğrenci", "pau obs", "pau eduroam",  "selam"
    ]
    return any(keyword in message.lower() for keyword in keywords)


@app.post("/api/chat")
async def chat(request: Request):
    data = await request.json()
    user_message = data.get("content") 
# Konu dışı mesaj kontrolü
    if not is_pamukkale_related(user_message):
        return {
            
            "message": {
                "role": "assistant",
                "content": "Üzgünüm, yalnızca Pamukkale Üniversitesi ile ilgili sorulara cevap verebiliyorum."
            }
        }
    payload = {
        "model": "deepseek-r1:8b",
        "messages": [
            {
            "role": "system",
            "content": PROMPT_MD
            },
            {
                "role": "user",
                "content": user_message
            }
        ],
        "think": False,
        "stream": False
    }

    async with httpx.AsyncClient(timeout=500.0) as client: #süre önemli yoksa fetch hatası veriyor ?
        response = await client.post(OLLAMA_URL, json=payload)
        response.raise_for_status()  

    return response.json()