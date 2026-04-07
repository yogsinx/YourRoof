from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, UploadFile, File, Form, Query
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pydantic import BaseModel, Field, EmailStr, ConfigDict, field_validator
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from bson import ObjectId
import secrets

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# JWT Configuration
JWT_ALGORITHM = "HS256"

def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]

# Password Hashing
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

# JWT Token Management
def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=15),
        "type": "access"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

# Auth Helper
async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])}, {"password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_admin(request: Request) -> dict:
    user = await get_current_user(request)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# Pydantic Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: str
    role: str = "buyer"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    phone: str
    role: str
    created_at: datetime

class PropertyCreate(BaseModel):
    title: str
    description: str
    property_type: str
    status: str
    price: float
    location: str
    city: str
    area_sqft: float
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    amenities: List[str] = []
    images: List[str] = []
    featured: bool = False

class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    property_type: Optional[str] = None
    status: Optional[str] = None
    price: Optional[float] = None
    location: Optional[str] = None
    city: Optional[str] = None
    area_sqft: Optional[float] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    amenities: Optional[List[str]] = None
    images: Optional[List[str]] = None
    featured: Optional[bool] = None

class PropertyResponse(BaseModel):
    id: str
    title: str
    description: str
    property_type: str
    status: str
    price: float
    location: str
    city: str
    area_sqft: float
    bedrooms: Optional[int]
    bathrooms: Optional[int]
    amenities: List[str]
    images: List[str]
    featured: bool
    created_at: datetime

class AppointmentCreate(BaseModel):
    property_id: str
    date: str
    time: str
    message: Optional[str] = None

class AppointmentUpdate(BaseModel):
    status: str

class LeadCreate(BaseModel):
    property_id: Optional[str] = None
    name: str
    email: EmailStr
    phone: str
    message: str
    source: str = "website"

class LeadUpdate(BaseModel):
    status: str
    notes: Optional[str] = None

class CommissionCreate(BaseModel):
    property_id: str
    agent_id: str
    amount: float
    percentage: float
    status: str = "pending"

class ForgotPassword(BaseModel):
    email: EmailStr

class ResetPassword(BaseModel):
    token: str
    new_password: str

# Admin Seeding
async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@yourroof.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "Admin@123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hashed,
            "name": "Admin",
            "phone": "+91-9068987898",
            "role": "admin",
            "created_at": datetime.now(timezone.utc)
        })
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}}
        )
    
    # Write test credentials
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write("# Test Credentials\n\n")
        f.write("## Admin Account\n")
        f.write(f"Email: {admin_email}\n")
        f.write(f"Password: {admin_password}\n")
        f.write(f"Role: admin\n\n")
        f.write("## Auth Endpoints\n")
        f.write("- POST /api/auth/register\n")
        f.write("- POST /api/auth/login\n")
        f.write("- GET /api/auth/me\n")
        f.write("- POST /api/auth/logout\n")

@app.on_event("startup")
async def startup_event():
    await seed_admin()
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.password_reset_tokens.create_index("expires_at", expireAfterSeconds=0)
    await db.login_attempts.create_index("identifier")
    await db.properties.create_index("city")
    await db.properties.create_index("property_type")
    await db.properties.create_index("status")

# Auth Endpoints
@api_router.post("/auth/register")
async def register(user_data: UserRegister, response: Response):
    email = user_data.email.lower()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = hash_password(user_data.password)
    user_doc = {
        "email": email,
        "password_hash": hashed,
        "name": user_data.name,
        "phone": user_data.phone,
        "role": user_data.role,
        "created_at": datetime.now(timezone.utc)
    }
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    access_token = create_access_token(user_id, email, user_data.role)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=900, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    
    return {
        "id": user_id,
        "email": email,
        "name": user_data.name,
        "phone": user_data.phone,
        "role": user_data.role,
        "created_at": user_doc["created_at"]
    }

@api_router.post("/auth/login")
async def login(credentials: UserLogin, request: Request, response: Response):
    email = credentials.email.lower()
    identifier = f"{request.client.host}:{email}"
    
    # Check brute force
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("attempts", 0) >= 5:
        lockout_time = attempt.get("locked_until")
        if lockout_time and datetime.now(timezone.utc) < lockout_time:
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again later.")
    
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        # Increment failed attempts
        if attempt:
            new_attempts = attempt.get("attempts", 0) + 1
            update_data = {"attempts": new_attempts}
            if new_attempts >= 5:
                update_data["locked_until"] = datetime.now(timezone.utc) + timedelta(minutes=15)
            await db.login_attempts.update_one({"identifier": identifier}, {"$set": update_data})
        else:
            await db.login_attempts.insert_one({"identifier": identifier, "attempts": 1})
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Clear failed attempts
    await db.login_attempts.delete_one({"identifier": identifier})
    
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, email, user["role"])
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=900, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    
    return {
        "id": user_id,
        "email": user["email"],
        "name": user["name"],
        "phone": user["phone"],
        "role": user["role"],
        "created_at": user["created_at"]
    }

@api_router.get("/auth/me")
async def get_me(request: Request):
    return await get_current_user(request)

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/")
    return {"message": "Logged out successfully"}

@api_router.post("/auth/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="Refresh token missing")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        user_id = str(user["_id"])
        access_token = create_access_token(user_id, user["email"], user["role"])
        response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=900, path="/")
        return {"message": "Token refreshed"}
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

@api_router.post("/auth/forgot-password")
async def forgot_password(data: ForgotPassword):
    email = data.email.lower()
    user = await db.users.find_one({"email": email})
    if not user:
        return {"message": "If email exists, reset link has been sent"}
    
    token = secrets.token_urlsafe(32)
    await db.password_reset_tokens.insert_one({
        "token": token,
        "user_id": user["_id"],
        "expires_at": datetime.now(timezone.utc) + timedelta(hours=1),
        "used": False
    })
    
    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
    reset_link = f"{frontend_url}/reset-password?token={token}"
    print(f"Password reset link: {reset_link}")
    
    return {"message": "If email exists, reset link has been sent"}

@api_router.post("/auth/reset-password")
async def reset_password(data: ResetPassword):
    reset_doc = await db.password_reset_tokens.find_one({"token": data.token})
    if not reset_doc:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    
    if reset_doc.get("used"):
        raise HTTPException(status_code=400, detail="Token already used")
    
    if datetime.now(timezone.utc) > reset_doc["expires_at"]:
        raise HTTPException(status_code=400, detail="Token expired")
    
    hashed = hash_password(data.new_password)
    await db.users.update_one(
        {"_id": reset_doc["user_id"]},
        {"$set": {"password_hash": hashed}}
    )
    await db.password_reset_tokens.update_one(
        {"token": data.token},
        {"$set": {"used": True}}
    )
    
    return {"message": "Password reset successfully"}

# Property Endpoints
@api_router.post("/properties")
async def create_property(property_data: PropertyCreate, request: Request):
    user = await get_current_admin(request)
    prop_doc = property_data.model_dump()
    prop_doc["created_at"] = datetime.now(timezone.utc)
    prop_doc["updated_at"] = datetime.now(timezone.utc)
    result = await db.properties.insert_one(prop_doc)
    prop_doc["id"] = str(result.inserted_id)
    return prop_doc

@api_router.get("/properties")
async def get_properties(
    property_type: Optional[str] = None,
    status: Optional[str] = None,
    city: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    featured: Optional[bool] = None,
    skip: int = 0,
    limit: int = 50
):
    query = {}
    if property_type:
        query["property_type"] = property_type
    if status:
        query["status"] = status
    if city:
        query["city"] = {"$regex": city, "$options": "i"}
    if min_price is not None or max_price is not None:
        query["price"] = {}
        if min_price is not None:
            query["price"]["$gte"] = min_price
        if max_price is not None:
            query["price"]["$lte"] = max_price
    if featured is not None:
        query["featured"] = featured
    
    properties = await db.properties.find(query).skip(skip).limit(limit).to_list(limit)
    for prop in properties:
        prop["id"] = str(prop.pop("_id", ""))
    return properties

@api_router.get("/properties/{property_id}")
async def get_property(property_id: str):
    prop = await db.properties.find_one({"_id": ObjectId(property_id)})
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    prop["id"] = str(prop.pop("_id"))
    return prop

@api_router.put("/properties/{property_id}")
async def update_property(property_id: str, property_data: PropertyUpdate, request: Request):
    user = await get_current_admin(request)
    update_data = {k: v for k, v in property_data.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)
    result = await db.properties.update_one(
        {"_id": ObjectId(property_id)},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Property not found")
    return {"message": "Property updated successfully"}

@api_router.delete("/properties/{property_id}")
async def delete_property(property_id: str, request: Request):
    user = await get_current_admin(request)
    result = await db.properties.delete_one({"_id": ObjectId(property_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Property not found")
    return {"message": "Property deleted successfully"}

# Appointment Endpoints
@api_router.post("/appointments")
async def create_appointment(appointment_data: AppointmentCreate, request: Request):
    user = await get_current_user(request)
    appt_doc = appointment_data.model_dump()
    appt_doc["user_id"] = str(user["_id"]) if "_id" in user else user["id"]
    appt_doc["user_name"] = user["name"]
    appt_doc["user_email"] = user["email"]
    appt_doc["user_phone"] = user["phone"]
    appt_doc["status"] = "pending"
    appt_doc["created_at"] = datetime.now(timezone.utc)
    result = await db.appointments.insert_one(appt_doc)
    appt_doc["id"] = str(result.inserted_id)
    appt_doc.pop("_id", None)  # Remove _id if present
    return appt_doc

@api_router.get("/appointments")
async def get_appointments(request: Request):
    user = await get_current_user(request)
    user_id = str(user["_id"]) if "_id" in user else user["id"]
    query = {} if user["role"] == "admin" else {"user_id": user_id}
    appointments = await db.appointments.find(query, {"_id": 0}).to_list(100)
    return appointments

@api_router.put("/appointments/{appointment_id}")
async def update_appointment(appointment_id: str, update_data: AppointmentUpdate, request: Request):
    user = await get_current_admin(request)
    result = await db.appointments.update_one(
        {"_id": ObjectId(appointment_id)},
        {"$set": {"status": update_data.status, "updated_at": datetime.now(timezone.utc)}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"message": "Appointment updated successfully"}

# Lead Endpoints
@api_router.post("/leads")
async def create_lead(lead_data: LeadCreate):
    lead_doc = lead_data.model_dump()
    lead_doc["status"] = "new"
    lead_doc["created_at"] = datetime.now(timezone.utc)
    result = await db.leads.insert_one(lead_doc)
    lead_doc["id"] = str(result.inserted_id)
    lead_doc.pop("_id", None)  # Remove _id if present
    return lead_doc

@api_router.get("/leads")
async def get_leads(request: Request, status: Optional[str] = None):
    user = await get_current_admin(request)
    query = {"status": status} if status else {}
    leads = await db.leads.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return leads

@api_router.put("/leads/{lead_id}")
async def update_lead(lead_id: str, update_data: LeadUpdate, request: Request):
    user = await get_current_admin(request)
    update_dict = update_data.model_dump()
    update_dict["updated_at"] = datetime.now(timezone.utc)
    result = await db.leads.update_one(
        {"_id": ObjectId(lead_id)},
        {"$set": update_dict}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"message": "Lead updated successfully"}

# Favorites Endpoints
@api_router.post("/favorites/{property_id}")
async def add_favorite(property_id: str, request: Request):
    user = await get_current_user(request)
    user_id = str(user["_id"]) if "_id" in user else user["id"]
    existing = await db.favorites.find_one({"user_id": user_id, "property_id": property_id})
    if existing:
        return {"message": "Already in favorites"}
    await db.favorites.insert_one({
        "user_id": user_id,
        "property_id": property_id,
        "created_at": datetime.now(timezone.utc)
    })
    return {"message": "Added to favorites"}

@api_router.delete("/favorites/{property_id}")
async def remove_favorite(property_id: str, request: Request):
    user = await get_current_user(request)
    user_id = str(user["_id"]) if "_id" in user else user["id"]
    result = await db.favorites.delete_one({"user_id": user_id, "property_id": property_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not in favorites")
    return {"message": "Removed from favorites"}

@api_router.get("/favorites")
async def get_favorites(request: Request):
    user = await get_current_user(request)
    user_id = str(user["_id"]) if "_id" in user else user["id"]
    favorites = await db.favorites.find({"user_id": user_id}, {"_id": 0}).to_list(100)
    property_ids = [ObjectId(f["property_id"]) for f in favorites]
    if not property_ids:
        return []
    properties = await db.properties.find({"_id": {"$in": property_ids}}).to_list(100)
    for prop in properties:
        prop["id"] = str(prop.pop("_id"))
    return properties

# Commission Endpoints
@api_router.post("/commissions")
async def create_commission(commission_data: CommissionCreate, request: Request):
    user = await get_current_admin(request)
    comm_doc = commission_data.model_dump()
    comm_doc["created_at"] = datetime.now(timezone.utc)
    result = await db.commissions.insert_one(comm_doc)
    comm_doc["id"] = str(result.inserted_id)
    return comm_doc

@api_router.get("/commissions")
async def get_commissions(request: Request, agent_id: Optional[str] = None, status: Optional[str] = None):
    user = await get_current_user(request)
    query = {}
    if user["role"] == "agent":
        user_id = str(user["_id"]) if "_id" in user else user["id"]
        query["agent_id"] = user_id
    elif agent_id:
        query["agent_id"] = agent_id
    if status:
        query["status"] = status
    commissions = await db.commissions.find(query, {"_id": 0}).to_list(100)
    return commissions

@api_router.put("/commissions/{commission_id}")
async def update_commission(commission_id: str, status: str, request: Request):
    user = await get_current_admin(request)
    result = await db.commissions.update_one(
        {"_id": ObjectId(commission_id)},
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc)}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Commission not found")
    return {"message": "Commission updated successfully"}

# Analytics Endpoints
@api_router.get("/analytics/overview")
async def get_analytics_overview(request: Request):
    user = await get_current_admin(request)
    
    total_properties = await db.properties.count_documents({})
    total_leads = await db.leads.count_documents({})
    total_appointments = await db.appointments.count_documents({})
    total_users = await db.users.count_documents({})
    
    new_leads = await db.leads.count_documents({"status": "new"})
    pending_appointments = await db.appointments.count_documents({"status": "pending"})
    
    # Revenue calculation
    total_commissions = await db.commissions.aggregate([
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]).to_list(1)
    total_revenue = total_commissions[0]["total"] if total_commissions else 0
    
    return {
        "total_properties": total_properties,
        "total_leads": total_leads,
        "total_appointments": total_appointments,
        "total_users": total_users,
        "new_leads": new_leads,
        "pending_appointments": pending_appointments,
        "total_revenue": total_revenue
    }

@api_router.get("/analytics/leads-by-source")
async def get_leads_by_source(request: Request):
    user = await get_current_admin(request)
    pipeline = [
        {"$group": {"_id": "$source", "count": {"$sum": 1}}},
        {"$project": {"source": "$_id", "count": 1, "_id": 0}}
    ]
    results = await db.leads.aggregate(pipeline).to_list(100)
    return results

@api_router.get("/analytics/properties-by-type")
async def get_properties_by_type(request: Request):
    user = await get_current_admin(request)
    pipeline = [
        {"$group": {"_id": "$property_type", "count": {"$sum": 1}}},
        {"$project": {"type": "$_id", "count": 1, "_id": 0}}
    ]
    results = await db.properties.aggregate(pipeline).to_list(100)
    return results

# Users Management (Admin)
@api_router.get("/users")
async def get_users(request: Request, role: Optional[str] = None):
    user = await get_current_admin(request)
    query = {"role": role} if role else {}
    users = await db.users.find(query, {"password_hash": 0, "_id": 0}).to_list(100)
    return users

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
