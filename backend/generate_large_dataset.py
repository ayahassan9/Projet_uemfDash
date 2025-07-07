#!/usr/bin/env python3
"""
Script pour générer un large ensemble de données étudiantes (100 000 profils)
avec une distribution réaliste pour tester les performances du système.
"""

import os
import json
import csv
import random
from datetime import datetime, timedelta
import string
import argparse

# Configuration des données
GENDER_DISTRIBUTION = {"Male": 0.52, "Female": 0.48}
NATIONALITIES = {
    "Moroccan": 0.70, 
    "French": 0.06, 
    "Spanish": 0.03, 
    "Algerian": 0.05, 
    "Tunisian": 0.04, 
    "Senegalese": 0.03, 
    "Chinese": 0.02, 
    "German": 0.01, 
    "Egyptian": 0.02, 
    "Saudi": 0.01, 
    "Nigerian": 0.01, 
    "Italian": 0.01, 
    "US": 0.01
}
CITIES = {
    "Casablanca": 0.25, 
    "Rabat": 0.15, 
    "Marrakech": 0.12, 
    "Fez": 0.10, 
    "Tangier": 0.08, 
    "Agadir": 0.06, 
    "Meknes": 0.05, 
    "Oujda": 0.04, 
    "Kenitra": 0.03, 
    "Tetouan": 0.03, 
    "Paris": 0.02, 
    "Madrid": 0.01, 
    "Algiers": 0.01, 
    "Cairo": 0.01, 
    "Dakar": 0.01, 
    "Beijing": 0.005, 
    "Berlin": 0.005, 
    "New York": 0.005, 
    "Riyadh": 0.005
}
BAC_TYPES = {
    "Scientific": 0.45, 
    "Economic": 0.25, 
    "Literary": 0.15, 
    "Technical": 0.10, 
    "Foreign": 0.05
}
SCHOOLS = {
    "Business School": 0.30, 
    "Engineering School": 0.25, 
    "Medical School": 0.15, 
    "Law School": 0.12, 
    "IT School": 0.10, 
    "Arts School": 0.08
}
SPECIALTIES = {
    "Business School": [
        "Finance", "Marketing", "Management", "Accounting", 
        "International Business", "Entrepreneurship", "Business Analytics"
    ],
    "Engineering School": [
        "Computer Science", "Civil Engineering", "Mechanical Engineering", 
        "Electrical Engineering", "Environmental Engineering", "Automotive Engineering"
    ],
    "Medical School": [
        "Medicine", "Pharmacy", "Nursing", "Biotechnology", "Public Health", "Dental"
    ],
    "Law School": [
        "Corporate Law", "Public Law", "International Law", "Criminal Law", "Tax Law"
    ],
    "IT School": [
        "Data Science", "Software Engineering", "Information Systems", "Cybersecurity", 
        "Artificial Intelligence", "Web Development"
    ],
    "Arts School": [
        "Visual Arts", "Graphic Design", "Interior Design", "Digital Arts", "Fashion Design"
    ]
}
CURRENT_STATUS = {
    "Active": 0.60, 
    "Graduated": 0.30, 
    "Dropped": 0.05, 
    "On Leave": 0.05
}
SCHOLARSHIP_RATE = 0.35  # 35% of students have scholarships

FIRST_NAMES_MALE = [
    "Ahmed", "Mohammed", "Youssef", "Ali", "Ibrahim", "Omar", "Hamza", "Mehdi", "Karim", 
    "Samir", "Nabil", "Jamal", "Reda", "Tarik", "Rachid", "Malik", "Bilal", "Adil", 
    "Hassan", "Amine", "Ismail", "Khalid", "Zakaria", "Abdellah", "Mustapha", "Jean", 
    "Pierre", "Thomas", "Carlos", "Liu", "Hans", "Pedro", "Daniel", "Michael"
]
FIRST_NAMES_FEMALE = [
    "Fatima", "Aisha", "Sara", "Lina", "Nora", "Amina", "Yasmine", "Layla", "Rim", 
    "Salma", "Hanane", "Sanaa", "Samira", "Khadija", "Naima", "Leila", "Meryem", 
    "Zineb", "Dounia", "Souad", "Assia", "Hajar", "Sophia", "Emma", "Marie", "Ana", 
    "Carmen", "Mei", "Zara", "Astrid", "Claudia", "Isabella"
]
LAST_NAMES = [
    "Alaoui", "Benani", "Idrissi", "Mansouri", "Tazi", "El Fassi", "Benjelloun", 
    "Zohra", "Chaoui", "Berrada", "El Amrani", "Chraibi", "Bennani", "Hassani", 
    "El Moutaouakil", "Benkirane", "Belhaj", "El Khattabi", "El Khalfi", "El Ouazzani",
    "Dupont", "Martin", "Smith", "Garcia", "Wei", "Müller", "Gonzalez", "Abdullah",
    "Diallo", "Ali", "El Houda", "Diop", "Chen", "Rodriguez", "Schmidt"
]

def weighted_choice(choices_dict):
    """Make a weighted random choice from a dictionary of options and weights."""
    options = list(choices_dict.keys())
    weights = list(choices_dict.values())
    return random.choices(options, weights=weights)[0]

def generate_name(gender):
    """Generate a random full name based on gender."""
    if gender == "Male":
        first_name = random.choice(FIRST_NAMES_MALE)
    else:
        first_name = random.choice(FIRST_NAMES_FEMALE)
    
    last_name = random.choice(LAST_NAMES)
    return f"{first_name} {last_name}"

def random_date(start_year=1995, end_year=2005):
    """Generate a random date between start_year and end_year."""
    start_date = datetime(start_year, 1, 1)
    end_date = datetime(end_year, 12, 31)
    days_between = (end_date - start_date).days
    return start_date + timedelta(days=random.randint(0, days_between))

def generate_id(number):
    """Generate a student ID in format E001, E002, ..."""
    return f"E{number:06d}"

def generate_mark(bac_type, with_scholarship):
    """Generate a realistic mark based on bac type and scholarship status."""
    base = {
        "Scientific": 16.0,
        "Economic": 15.0,
        "Literary": 14.0,
        "Technical": 15.5,
        "Foreign": 16.5
    }.get(bac_type, 15.0)
    
    # Scholarship students tend to have higher marks
    if with_scholarship:
        base += 1.0
    
    # Add some random variation
    variation = random.normalvariate(0, 1.2)
    mark = base + variation
    
    # Ensure mark is between 10 and 20
    return max(10.0, min(20.0, round(mark, 1)))

def generate_graduated(status, mark, current_year, start_year):
    """Determine if a student has graduated based on status, mark and years enrolled."""
    if status == "Graduated":
        return True
    elif status == "Dropped":
        return False
    
    # For active students, check if they've been enrolled long enough
    years_enrolled = current_year - start_year
    if years_enrolled >= 3:  # Minimum years to graduate
        # Higher marks increase graduation probability
        grad_probability = (mark - 10) / 10  # 0.0 to 1.0
        return random.random() < grad_probability
    
    return False

def generate_semester_marks(base_mark, num_semesters, graduated):
    """Generate semester marks with a trend that makes sense for the student's outcome."""
    marks = []
    
    # Determine trend based on graduation status
    if graduated:
        # Gradual improvement trend for graduates
        trend = 0.1
    else:
        # Slight downward trend for non-graduates
        trend = -0.05
    
    for i in range(num_semesters):
        # Calculate mark with trend and some random variation
        semester_variation = random.normalvariate(0, 0.7)
        semester_trend = i * trend
        semester_mark = base_mark + semester_trend + semester_variation
        
        # Ensure mark is between 5 and 20
        semester_mark = max(5.0, min(20.0, round(semester_mark, 1)))
        marks.append({"mark": semester_mark})
    
    return marks

def generate_school_specialty(gender, bac_type, mark):
    """Generate a school and specialty based on demographic factors."""
    # Weighted preferences based on demographics
    if bac_type == "Scientific":
        school_prefs = {"Engineering School": 0.40, "Medical School": 0.30, "IT School": 0.15, 
                        "Business School": 0.15}
    elif bac_type == "Economic":
        school_prefs = {"Business School": 0.70, "Law School": 0.20, "IT School": 0.10}
    elif bac_type == "Literary":
        school_prefs = {"Law School": 0.50, "Arts School": 0.30, "Business School": 0.20}
    elif bac_type == "Technical":
        school_prefs = {"Engineering School": 0.60, "IT School": 0.30, "Business School": 0.10}
    else:  # Foreign
        school_prefs = {"Business School": 0.40, "Engineering School": 0.30, 
                        "Medical School": 0.15, "Law School": 0.15}
    
    # Adjust for mark (high performers more likely to get into competitive schools)
    if mark >= 16:
        if "Medical School" in school_prefs:
            school_prefs["Medical School"] *= 1.5
        if "Engineering School" in school_prefs:
            school_prefs["Engineering School"] *= 1.2
    
    # Normalize probabilities
    total = sum(school_prefs.values())
    school_prefs = {k: v/total for k, v in school_prefs.items()}
    
    # Choose school
    school = weighted_choice(school_prefs)
    
    # Choose specialty from that school
    specialty = random.choice(SPECIALTIES[school])
    
    return school, specialty

def generate_large_dataset(num_records=100000, output_file=None, start_id=1):
    """Generate a large dataset of student records."""
    if output_file is None:
        output_file = os.path.join(os.path.dirname(__file__), 'data', f'students_{num_records}.csv')
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    print(f"Generating {num_records} student records...")
    
    # Get current year for calculations
    current_year = datetime.now().year
    
    # Define all columns including semester columns
    columns = ['ID', 'Name', 'Gender', 'Nationality', 'City', 'Birth_Date', 'Baccalaureat_Type', 
               'Mark', 'School', 'Specialty', 'Start_Year', 'Scholarship', 'Current_Status', 'Graduated']
    
    # Add semester columns S1-S12
    for i in range(1, 13):
        columns.append(f'S{i}')
    
    # Create output file and write header
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(columns)
        
        # Generate and write records in batches
        batch_size = 1000
        for batch_start in range(0, num_records, batch_size):
            batch_end = min(batch_start + batch_size, num_records)
            batch_records = []
            
            for i in range(batch_start, batch_end):
                record_id = start_id + i
                
                # Generate demographic data
                gender = weighted_choice(GENDER_DISTRIBUTION)
                name = generate_name(gender)
                nationality = weighted_choice(NATIONALITIES)
                city = weighted_choice(CITIES)
                birth_date = random_date().strftime('%Y-%m-%d')
                
                # Generate academic data
                bac_type = weighted_choice(BAC_TYPES)
                scholarship = random.random() < SCHOLARSHIP_RATE
                
                # More variables depend on these demographics
                mark = generate_mark(bac_type, scholarship)
                school, specialty = generate_school_specialty(gender, bac_type, mark)
                
                # Determine student history
                # Students start between 2017 and current year
                start_year = random.randint(2017, current_year)
                max_study_years = min(6, current_year - start_year + 1)  # Maximum 6 years or up to now
                
                # Current status depends on time enrolled and performance
                years_enrolled = current_year - start_year
                if years_enrolled <= 2:  # First two years
                    status_probs = {"Active": 0.9, "Dropped": 0.07, "On Leave": 0.03, "Graduated": 0}
                elif years_enrolled <= 4:  # Years 3-4
                    status_probs = {"Active": 0.6, "Graduated": 0.3, "Dropped": 0.05, "On Leave": 0.05}
                else:  # Year 5+
                    status_probs = {"Graduated": 0.7, "Active": 0.2, "Dropped": 0.08, "On Leave": 0.02}
                
                # Adjust for performance
                if mark >= 16:  # High performers
                    status_probs["Graduated"] = status_probs.get("Graduated", 0) * 1.3
                    status_probs["Dropped"] = status_probs.get("Dropped", 0) * 0.5
                elif mark < 12:  # Low performers
                    status_probs["Graduated"] = status_probs.get("Graduated", 0) * 0.6
                    status_probs["Dropped"] = status_probs.get("Dropped", 0) * 1.5
                
                # Normalize probabilities
                total = sum(status_probs.values())
                if total > 0:
                    status_probs = {k: v/total for k, v in status_probs.items()}
                    status = weighted_choice(status_probs)
                else:
                    status = "Active"  # Default
                
                # Determine graduation status
                graduated = generate_graduated(status, mark, current_year, start_year)
                
                # Generate semester marks
                num_semesters = min(years_enrolled * 2, 12)  # 2 semesters per year, max 12
                semester_marks = generate_semester_marks(mark, num_semesters, graduated)
                
                # Create the record
                record = [
                    generate_id(record_id),
                    name,
                    gender,
                    nationality,
                    city,
                    birth_date,
                    bac_type,
                    str(mark),
                    school,
                    specialty,
                    str(start_year),
                    str(scholarship),
                    status,
                    str(graduated)
                ]
                
                # Add semester data
                for sem_num in range(1, 13):
                    if sem_num <= num_semesters:
                        record.append(json.dumps(semester_marks[sem_num - 1]))
                    else:
                        record.append("")  # Empty for future semesters
                
                batch_records.append(record)
            
            # Write the batch
            writer.writerows(batch_records)
            print(f"Progress: {batch_end}/{num_records} records generated ({batch_end/num_records*100:.1f}%)")
    
    print(f"Dataset generation complete. File saved to: {output_file}")
    return output_file

def main():
    """Main function to run the script with command line arguments."""
    parser = argparse.ArgumentParser(description='Generate a large dataset of student records')
    parser.add_argument('-n', '--num-records', type=int, default=100000,
                        help='Number of student records to generate (default: 100000)')
    parser.add_argument('-o', '--output', type=str, default=None,
                        help='Output file path (default: data/students_N.csv)')
    parser.add_argument('-s', '--start-id', type=int, default=1,
                        help='Starting ID number (default: 1)')
    
    args = parser.parse_args()
    
    generate_large_dataset(args.num_records, args.output, args.start_id)

if __name__ == "__main__":
    main()
