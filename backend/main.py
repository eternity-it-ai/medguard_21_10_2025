from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from service import router

app = FastAPI()

# Include the router from the service module
app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://medguard-21-10-2025.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)