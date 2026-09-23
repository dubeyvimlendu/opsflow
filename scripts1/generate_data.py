import csv
import random
from datetime import date, timedelta
from pathlib import Path


# -----------------------------
# Configuration
# -----------------------------

NUM_EMPLOYEES = 250
SEED = 42

random.seed(SEED)

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

CLEAN_FILE = DATA_DIR / "employees_clean.csv"
RAW_FILE = DATA_DIR / "employees_raw.csv"


# -----------------------------
# Sample data
# -----------------------------

FIRST_NAMES = [
    "Aarav", "Aditi", "Akash", "Aman", "Ananya",
    "Arjun", "Aryan", "Diya", "Ishaan", "Karan",
    "Kavya", "Meera", "Neha", "Nikhil", "Pooja",
    "Rahul", "Riya", "Rohan", "Sakshi", "Shreya",
    "Siddharth", "Simran", "Tanvi", "Varun", "Vivek"
]

LAST_NAMES = [
    "Sharma", "Verma", "Singh", "Gupta", "Patel",
    "Mishra", "Dubey", "Yadav", "Kumar", "Mehta",
    "Agarwal", "Joshi", "Malhotra", "Srivastava",
    "Chauhan"
]

DEPARTMENTS = [
    "Engineering",
    "IT",
    "Finance",
    "HR",
    "Sales",
    "Marketing",
    "Operations"
]

DESIGNATIONS = {
    "Engineering": [
        "Software Engineer",
        "Senior Software Engineer",
        "QA Engineer",
        "Project Manager"
    ],
    "IT": [
        "System Administrator",
        "DevOps Engineer",
        "IT Support Engineer"
    ],
    "Finance": [
        "Financial Analyst",
        "Accountant",
        "Finance Manager"
    ],
    "HR": [
        "HR Executive",
        "HR Manager",
        "Recruitment Specialist"
    ],
    "Sales": [
        "Sales Executive",
        "Sales Manager",
        "Business Development Executive"
    ],
    "Marketing": [
        "Marketing Executive",
        "Marketing Manager",
        "Content Specialist"
    ],
    "Operations": [
        "Operations Associate",
        "Operations Manager",
        "Business Analyst"
    ]
}

STATUS_OPTIONS = [
    "Active",
    "Inactive",
    "On Leave"
]


# -----------------------------
# Helper functions
# -----------------------------

def random_joining_date():
    """
    Generate a joining date between
    January 2020 and December 2025.
    """

    start = date(2020, 1, 1)
    end = date(2025, 12, 31)

    days_between = (end - start).days

    return start + timedelta(
        days=random.randint(0, days_between)
    )


def generate_employee(employee_number):
    first_name = random.choice(FIRST_NAMES)
    last_name = random.choice(LAST_NAMES)

    department = random.choice(DEPARTMENTS)

    designation = random.choice(
        DESIGNATIONS[department]
    )

    email = (
        f"{first_name.lower()}."
        f"{last_name.lower()}"
        f"{employee_number}"
        "@opsflow.com"
    )

    salary = random.randint(35000, 150000)

    joining_date = random_joining_date()

    status = random.choices(
        STATUS_OPTIONS,
        weights=[80, 10, 10],
        k=1
    )[0]

    return {
        "employee_code": f"EMP{employee_number:04d}",
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "department": department,
        "designation": designation,
        "salary": salary,
        "joining_date": joining_date.isoformat(),
        "status": status
    }


# -----------------------------
# Generate clean dataset
# -----------------------------

def generate_clean_dataset():
    employees = []

    for employee_number in range(1, NUM_EMPLOYEES + 1):
        employees.append(
            generate_employee(employee_number)
        )

    return employees


# -----------------------------
# Inject data-quality problems
# -----------------------------

def create_raw_dataset(clean_data):

    raw_data = [
        employee.copy()
        for employee in clean_data
    ]

    # 1. Duplicate employee
    raw_data.append(raw_data[10].copy())

    # 2. Duplicate email
    duplicate_email = raw_data[20].copy()
    duplicate_email["employee_code"] = "EMP9991"
    raw_data.append(duplicate_email)

    # 3. Invalid email
    raw_data[30]["email"] = "invalid-email"

    # 4. Negative salary
    raw_data[40]["salary"] = -5000

    # 5. Missing salary
    raw_data[50]["salary"] = ""

    # 6. Missing department
    raw_data[60]["department"] = ""

    # 7. Extra whitespace
    raw_data[70]["first_name"] = (
        f"  {raw_data[70]['first_name']}  "
    )

    # 8. Inconsistent department capitalization
    raw_data[80]["department"] = "engineering"

    # 9. Invalid status
    raw_data[90]["status"] = "Working"

    # 10. Invalid joining date
    raw_data[100]["joining_date"] = "2025-99-99"

    # 11. Invalid employee code
    raw_data[110]["employee_code"] = "EMP12"

    # 12. Missing email
    raw_data[120]["email"] = ""

    return raw_data


# -----------------------------
# Write CSV
# -----------------------------

def write_csv(file_path, data):

    fieldnames = [
        "employee_code",
        "first_name",
        "last_name",
        "email",
        "department",
        "designation",
        "salary",
        "joining_date",
        "status"
    ]

    with open(
        file_path,
        "w",
        newline="",
        encoding="utf-8"
    ) as file:

        writer = csv.DictWriter(
            file,
            fieldnames=fieldnames
        )

        writer.writeheader()
        writer.writerows(data)


# -----------------------------
# Main
# -----------------------------

def main():

    DATA_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    clean_data = generate_clean_dataset()

    raw_data = create_raw_dataset(
        clean_data
    )

    write_csv(
        CLEAN_FILE,
        clean_data
    )

    write_csv(
        RAW_FILE,
        raw_data
    )

    print("Dataset generation completed.")
    print(f"Clean dataset : {CLEAN_FILE}")
    print(f"Raw dataset   : {RAW_FILE}")
    print(f"Clean records : {len(clean_data)}")
    print(f"Raw records   : {len(raw_data)}")


if __name__ == "__main__":
    main()