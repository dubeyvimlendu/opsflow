from app.services.employee_processor import load_employee_data


def inspect_employee_data():
    df = load_employee_data()

    print("\n===== DATASET OVERVIEW =====")

    print(f"Rows    : {len(df)}")
    print(f"Columns : {len(df.columns)}")

    print("\n===== COLUMNS =====")

    for column in df.columns:
        print(column)

    print("\n===== MISSING VALUES =====")

    print(df.isnull().sum())

    print("\n===== DATA TYPES =====")

    print(df.dtypes)

    print("\n===== DUPLICATES =====")

    print(
        f"Duplicate rows: {df.duplicated().sum()}"
    )


if __name__ == "__main__":
    inspect_employee_data()