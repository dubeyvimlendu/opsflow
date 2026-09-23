from pathlib import Path

import pandas as pd


BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data"

RAW_FILE = DATA_DIR / "employees_raw.csv"


def load_employee_data() -> pd.DataFrame:
    """
    Load employee data from the raw CSV file.
    """

    if not RAW_FILE.exists():
        raise FileNotFoundError(
            f"Employee data not found: {RAW_FILE}"
        )

    df = pd.read_csv(RAW_FILE)

    return df