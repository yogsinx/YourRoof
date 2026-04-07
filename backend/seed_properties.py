import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

sample_properties = [
    {
        "title": "Luxury Villa in Sector 128",
        "description": "Experience unparalleled luxury in this stunning 4BHK villa with modern amenities, spacious interiors, and a private garden. Perfect for families seeking comfort and elegance.",
        "property_type": "residential",
        "status": "ready_to_move",
        "price": 52000000,
        "location": "Sector 128",
        "city": "Noida",
        "area_sqft": 3500,
        "bedrooms": 4,
        "bathrooms": 4,
        "amenities": ["Swimming Pool", "Gym", "Garden", "Parking", "Security", "Club House"],
        "images": ["https://images.unsplash.com/photo-1706855203772-c249b75fe016"],
        "featured": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    },
    {
        "title": "Modern Office Space in Sector 72",
        "description": "Prime commercial property ideal for corporates and startups. High-speed connectivity, modern infrastructure, and strategic location near metro station.",
        "property_type": "commercial",
        "status": "under_construction",
        "price": 7500000,
        "location": "Sector 72",
        "city": "Noida",
        "area_sqft": 1200,
        "bedrooms": None,
        "bathrooms": 2,
        "amenities": ["Parking", "Security", "Power Backup", "Elevator", "Reception"],
        "images": ["https://images.unsplash.com/photo-1641998148499-cb6b55a3c0d3"],
        "featured": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    },
    {
        "title": "Premium 3BHK Apartment",
        "description": "Spacious 3BHK apartment with panoramic city views, modern kitchen, and luxury fittings. Located in a premium gated community with world-class amenities.",
        "property_type": "residential",
        "status": "new_launch",
        "price": 21600000,
        "location": "Sector 44",
        "city": "Noida",
        "area_sqft": 1850,
        "bedrooms": 3,
        "bathrooms": 3,
        "amenities": ["Swimming Pool", "Gym", "Park", "Parking", "Security", "Kids Play Area"],
        "images": ["https://images.unsplash.com/photo-1706808849827-7366c098b317"],
        "featured": False,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    },
    {
        "title": "Retail Shop in Greater Noida",
        "description": "High-footfall retail space in prime commercial zone. Perfect for retail businesses, cafes, or showrooms. Ready for immediate possession.",
        "property_type": "commercial",
        "status": "ready_to_move",
        "price": 4560000,
        "location": "Knowledge Park",
        "city": "Greater Noida",
        "area_sqft": 800,
        "bedrooms": None,
        "bathrooms": 1,
        "amenities": ["Parking", "Security", "Power Backup", "Water Supply"],
        "images": ["https://images.unsplash.com/photo-1641998148499-cb6b55a3c0d3"],
        "featured": False,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    },
    {
        "title": "Studio Apartment in Sector 62",
        "description": "Compact and efficient studio apartment perfect for young professionals. Modern design with all essential amenities in a great location.",
        "property_type": "residential",
        "status": "ready_to_move",
        "price": 3500000,
        "location": "Sector 62",
        "city": "Noida",
        "area_sqft": 550,
        "bedrooms": 1,
        "bathrooms": 1,
        "amenities": ["Parking", "Security", "Gym", "Power Backup"],
        "images": ["https://images.unsplash.com/photo-1706855203772-c249b75fe016"],
        "featured": False,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    },
    {
        "title": "Ultra Luxury Penthouse",
        "description": "Crown jewel of luxury living. This penthouse offers breathtaking views, private terrace, home automation, and bespoke interiors. For those who demand the finest.",
        "property_type": "residential",
        "status": "under_construction",
        "price": 85000000,
        "location": "Sector 150",
        "city": "Noida",
        "area_sqft": 5200,
        "bedrooms": 5,
        "bathrooms": 6,
        "amenities": ["Private Pool", "Gym", "Home Theatre", "Smart Home", "Terrace Garden", "Parking", "Security", "Concierge"],
        "images": ["https://images.unsplash.com/photo-1706808849827-7366c098b317"],
        "featured": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
]

async def seed_data():
    # Clear existing properties
    await db.properties.delete_many({})
    
    # Insert sample properties
    result = await db.properties.insert_many(sample_properties)
    print(f"Inserted {len(result.inserted_ids)} sample properties")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_data())
