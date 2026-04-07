import requests
import sys
import json
from datetime import datetime

class ChannelPartnershipAPITester:
    def __init__(self, base_url="https://channel-ops-2.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})
        self.tests_run = 0
        self.tests_passed = 0
        self.admin_credentials = {
            "email": "admin@yourroof.com",
            "password": "Admin@123"
        }
        self.test_user_credentials = {
            "email": f"test_user_{datetime.now().strftime('%H%M%S')}@test.com",
            "password": "TestPass123!",
            "name": "Test User",
            "phone": "+91-9876543210",
            "role": "buyer"
        }

    def run_test(self, name, method, endpoint, expected_status, data=None, auth_required=False):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = self.session.get(url)
            elif method == 'POST':
                response = self.session.post(url, json=data)
            elif method == 'PUT':
                response = self.session.put(url, json=data)
            elif method == 'DELETE':
                response = self.session.delete(url)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"   Error: {error_detail}")
                except:
                    print(f"   Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_admin_login(self):
        """Test admin login and get session cookies"""
        print("\n=== Testing Admin Authentication ===")
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data=self.admin_credentials
        )
        if success:
            print(f"   Admin user: {response.get('name', 'Unknown')}, Role: {response.get('role', 'Unknown')}")
            return True
        return False

    def test_user_registration(self):
        """Test user registration"""
        print("\n=== Testing User Registration ===")
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=self.test_user_credentials
        )
        if success:
            print(f"   Registered user: {response.get('name', 'Unknown')}, Role: {response.get('role', 'Unknown')}")
            return True
        return False

    def test_user_login(self):
        """Test user login"""
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data={
                "email": self.test_user_credentials["email"],
                "password": self.test_user_credentials["password"]
            }
        )
        return success

    def test_auth_me(self):
        """Test getting current user info"""
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )
        if success:
            print(f"   Current user: {response.get('name', 'Unknown')}")
        return success

    def test_properties_endpoints(self):
        """Test property-related endpoints"""
        print("\n=== Testing Property Endpoints ===")
        
        # Test get properties (public endpoint)
        success, properties = self.run_test(
            "Get Properties",
            "GET",
            "properties",
            200
        )
        
        if success and properties:
            print(f"   Found {len(properties)} properties")
            
            # Test get specific property
            if len(properties) > 0:
                property_id = properties[0].get('id')
                if property_id:
                    success, property_detail = self.run_test(
                        "Get Property Detail",
                        "GET",
                        f"properties/{property_id}",
                        200
                    )
                    if success:
                        print(f"   Property detail: {property_detail.get('title', 'Unknown')}")
        
        # Test property filters
        self.run_test(
            "Filter Properties by Type",
            "GET",
            "properties?property_type=residential",
            200
        )
        
        self.run_test(
            "Filter Properties by Status",
            "GET",
            "properties?status=ready_to_move",
            200
        )
        
        self.run_test(
            "Filter Properties by City",
            "GET",
            "properties?city=Mumbai",
            200
        )
        
        self.run_test(
            "Filter Featured Properties",
            "GET",
            "properties?featured=true",
            200
        )

    def test_appointments_endpoints(self):
        """Test appointment-related endpoints"""
        print("\n=== Testing Appointment Endpoints ===")
        
        # First get properties to book appointment for
        success, properties = self.run_test(
            "Get Properties for Appointment",
            "GET",
            "properties",
            200
        )
        
        if success and properties and len(properties) > 0:
            property_id = properties[0].get('id')
            
            # Test create appointment
            appointment_data = {
                "property_id": property_id,
                "date": "2024-12-25",
                "time": "10:00",
                "message": "Test appointment booking"
            }
            
            success, appointment = self.run_test(
                "Create Appointment",
                "POST",
                "appointments",
                200,
                data=appointment_data
            )
            
            if success:
                print(f"   Appointment created for property: {property_id}")
        
        # Test get appointments
        self.run_test(
            "Get User Appointments",
            "GET",
            "appointments",
            200
        )

    def test_favorites_endpoints(self):
        """Test favorites-related endpoints"""
        print("\n=== Testing Favorites Endpoints ===")
        
        # First get properties to add to favorites
        success, properties = self.run_test(
            "Get Properties for Favorites",
            "GET",
            "properties",
            200
        )
        
        if success and properties and len(properties) > 0:
            property_id = properties[0].get('id')
            print(f"   Using property_id: {property_id}")
            
            # Test add to favorites
            success, response = self.run_test(
                "Add to Favorites",
                "POST",
                f"favorites/{property_id}",
                200
            )
            
            if success:
                print(f"   Added property {property_id} to favorites")
                
                # Test get favorites
                self.run_test(
                    "Get User Favorites",
                    "GET",
                    "favorites",
                    200
                )
                
                # Test remove from favorites
                self.run_test(
                    "Remove from Favorites",
                    "DELETE",
                    f"favorites/{property_id}",
                    200
                )

    def test_leads_endpoints(self):
        """Test lead-related endpoints (admin required)"""
        print("\n=== Testing Lead Endpoints ===")
        
        # Test create lead (public endpoint)
        lead_data = {
            "name": "Test Lead",
            "email": "testlead@example.com",
            "phone": "+91-9876543210",
            "message": "Interested in properties",
            "source": "website"
        }
        
        success, lead = self.run_test(
            "Create Lead",
            "POST",
            "leads",
            200,
            data=lead_data
        )
        
        if success:
            print(f"   Lead created: {lead.get('name', 'Unknown')}")

    def test_admin_endpoints(self):
        """Test admin-only endpoints"""
        print("\n=== Testing Admin Endpoints ===")
        
        # Login as admin first
        if not self.test_admin_login():
            print("❌ Admin login failed, skipping admin tests")
            return
        
        # Test analytics
        self.run_test(
            "Get Analytics Overview",
            "GET",
            "analytics/overview",
            200
        )
        
        self.run_test(
            "Get Leads by Source",
            "GET",
            "analytics/leads-by-source",
            200
        )
        
        self.run_test(
            "Get Properties by Type",
            "GET",
            "analytics/properties-by-type",
            200
        )
        
        # Test get all leads
        self.run_test(
            "Get All Leads (Admin)",
            "GET",
            "leads",
            200
        )
        
        # Test get all appointments
        self.run_test(
            "Get All Appointments (Admin)",
            "GET",
            "appointments",
            200
        )
        
        # Test get all users
        self.run_test(
            "Get All Users (Admin)",
            "GET",
            "users",
            200
        )

    def test_logout(self):
        """Test logout functionality"""
        print("\n=== Testing Logout ===")
        self.run_test(
            "Logout",
            "POST",
            "auth/logout",
            200
        )

def main():
    print("🚀 Starting Channel Partnership API Tests")
    print("=" * 50)
    
    tester = ChannelPartnershipAPITester()
    
    # Test user registration and login flow
    if not tester.test_user_registration():
        print("❌ User registration failed, stopping tests")
        return 1
    
    if not tester.test_user_login():
        print("❌ User login failed, stopping tests")
        return 1
    
    # Test authenticated endpoints
    tester.test_auth_me()
    tester.test_properties_endpoints()
    tester.test_appointments_endpoints()
    tester.test_favorites_endpoints()
    tester.test_leads_endpoints()
    
    # Test admin endpoints
    tester.test_admin_endpoints()
    
    # Test logout
    tester.test_logout()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Tests completed: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())