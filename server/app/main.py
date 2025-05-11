from fastapi import FastAPI
from app.api import auth,entries,notification
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

app = FastAPI()
app.include_router(auth.router)
app.include_router(entries.router)
app.include_router(notification.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","https://well-done-today.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="WellDoneToday API",
        version="1.0.0",
        description="API for WellDoneToday app",
        routes=app.routes,
    )

    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }

    for path in openapi_schema["paths"].values():
        for method in path.values():
            method.setdefault("security", [{"BearerAuth": []}])

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

@app.get("/")
def read_root():
    return {"message": "WellDoneToday backend is running"}
