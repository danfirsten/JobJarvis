import gspread
from oauth2client.service_account import ServiceAccountCredentials
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # ✅ Import CORS middleware
import requests
from bs4 import BeautifulSoup
import pandas as pd
import re
from datetime import datetime
from collections import Counter

app = FastAPI()

# ✅ Add CORS middleware to allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allows requests from any frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

GITHUB_URL = "https://raw.githubusercontent.com/SimplifyJobs/Summer2025-Internships/refs/heads/dev/README.md"

# Google Sheets Setup
SHEET_NAME = "Internship Tracker"  # Name of your Google Sheet
scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/spreadsheets",
         "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_name("credentials.json", scope)
client = gspread.authorize(creds)
sheet = client.open(SHEET_NAME).sheet1  # Open the first sheet

def save_to_sheets(company, title, location, link):
    current_date = datetime.now().strftime("%Y-%m-%d")
    status = "Submitted"

    print(f"📝 Writing to Google Sheets: {company}, {title}, {location}, {link}, {current_date}, {status}")  # ✅ Debugging log

    sheet.append_row([company, title, location, link, current_date, status])
    print("✅ Row successfully added to Google Sheets!")  # ✅ Debugging log


@app.get("/get_application_stats")
def get_application_stats():
    """Returns the number of applications per day."""
    data = sheet.get_all_values()
    date_column = [row[4] for row in data[1:]]  # Extract "Date Submitted" column

    date_counts = Counter(date_column)  # Count applications per date
    return date_counts

@app.post("/track_application")
def track_application(data: dict):
    """Receives internship details and saves to Google Sheets"""
    company = data.get("Company")
    title = data.get("Title")
    location = data.get("Location")
    link = data.get("Link")

    print(f"📥 Received application: {company}, {title}, {location}, {link}")  # ✅ Debugging log

    if company and title and location and link:
        save_to_sheets(company, title, location, link)
        print("✅ Successfully added to Google Sheets!")  # ✅ Debugging log
        return {"message": "Application tracked successfully"}
    
    print("❌ Invalid data received")  # ✅ Debugging log
    return {"error": "Invalid data received"}


@app.get("/")
def home():
    return {"message": "Welcome to the Internship API! Visit /internships to see listings."}

def clean_link(link):
    """Extracts the actual job URL from an HTML <a> tag."""
    match = re.search(r'href="([^"]+)"', link)
    return match.group(1) if match else link

def clean_company_name(company):
    """Extracts plain company name from markdown format like **[Company](link)**."""
    match = re.search(r"\*\*\[(.*?)\]\(.*?\)\*\*", company)  # Extract text inside **[Company]**
    return match.group(1) if match else company

def fetch_internships():
    """Fetches internship data from the GitHub repo."""
    response = requests.get(GITHUB_URL)
    if response.status_code != 200:
        return []
    
    content = response.text
    lines = content.split('\n')
    
    internships = []
    last_company = None

    for line in lines:
        if "|" in line and "Company" not in line:
            fields = line.split("|")
            if len(fields) > 4:
                company_name = clean_company_name(fields[1].strip())

                
                if company_name == "↳":
                    company_name = last_company

                internships.append({
                    "Company": company_name,
                    "Title": fields[2].strip(),
                    "Location": fields[3].strip(),
                    "Link": clean_link(fields[4].strip())
                })

                last_company = company_name
    
    return internships

@app.get("/internships")
def get_internships(location: str = None, keyword: str = None):
    """API endpoint to fetch and filter internships."""
    internships = fetch_internships()
    
    if location:
        internships = [job for job in internships if location.lower() in job["Location"].lower()]
    if keyword:
        internships = [job for job in internships if keyword.lower() in job["Title"].lower()]
    
    return {"internships": internships}
