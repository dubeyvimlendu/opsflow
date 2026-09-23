from app.repositories.employee_repository import (
    insert_employees,
)

from app.services.employee_processor import (
    load_employee_data,
)

from app.services.employee_validator import (
    validate_employee_data,
)

from app.utils.cleaners import (
    clean_employee_data,
)


def load_valid_employees():

    print("\nLoading employee data...")

    df = load_employee_data()

    print(
        f"Loaded {len(df)} raw records."
    )

    print("\nCleaning data...")

    cleaned_df = clean_employee_data(df)

    print("Cleaning completed.")

    print("\nValidating data...")

    valid_df, invalid_df = (
        validate_employee_data(
            cleaned_df
        )
    )

    print(
        f"Valid records   : {len(valid_df)}"
    )

    print(
        f"Invalid records : {len(invalid_df)}"
    )

    print("\nLoading valid records into MySQL...")

    inserted_count = insert_employees(
        valid_df
    )

    print(
        f"Inserted records : {inserted_count}"
    )


if __name__ == "__main__":
    load_valid_employees()