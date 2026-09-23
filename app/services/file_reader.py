from pathlib import Path

import pandas as pd


SUPPORTED_EXTENSIONS = {
    ".csv",
    ".xlsx",
    ".json",
}


def read_file(file_path: str | Path) -> pd.DataFrame:
    """
    Read a supported employee data file and return a DataFrame.
    """

    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(
            f"File not found: {path}"
        )

    extension = path.suffix.lower()

    if extension not in SUPPORTED_EXTENSIONS:
        raise ValueError(
            f"Unsupported file format: {extension}. "
            f"Supported formats: {', '.join(sorted(SUPPORTED_EXTENSIONS))}"
        )

    if extension == ".csv":
        return pd.read_csv(path)

    if extension == ".xlsx":
        return pd.read_excel(path)

    if extension == ".json":
        return pd.read_json(path)

    # Defensive fallback
    raise ValueError(
        f"Unsupported file format: {extension}"
    )