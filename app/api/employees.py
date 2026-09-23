from pathlib import Path

from fastapi import (
    APIRouter,
    File,
    HTTPException,
    UploadFile,
    status,
)

from app.schemas.employee import (
    EmployeeCreate,
    EmployeeResponse,
)

from app.services.employee_service import (
    add_employee,
    find_employee,
    list_employees,
)

from app.services.file_reader import read_file
from app.services.import_service import process_employee_import


router = APIRouter(
    prefix="/api/employees",
    tags=["Employees"],
)


# ============================================================
# Employee CRUD
# ============================================================


@router.get(
    "",
    response_model=list[EmployeeResponse],
)
def get_employees():
    return list_employees()


@router.get(
    "/{employee_code}",
    response_model=EmployeeResponse,
)
def get_employee(employee_code: str):
    return find_employee(employee_code)


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
)
def create_new_employee(
    employee: EmployeeCreate,
):
    return add_employee(employee)


# ============================================================
# Employee Import
# ============================================================


@router.post(
    "/import",
)
async def import_employees(
    file: UploadFile = File(...),
):
    """
    Upload an employee data file and process it through
    the complete OpsFlow data pipeline.

    Supported formats:
        - CSV
        - XLSX
        - JSON
    """

    # --------------------------------------------------------
    # 1. Validate filename
    # --------------------------------------------------------

    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File name is required",
        )

    # --------------------------------------------------------
    # 2. Validate file extension
    # --------------------------------------------------------

    allowed_extensions = {
        ".csv",
        ".xlsx",
        ".json",
    }

    extension = Path(
        file.filename
    ).suffix.lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Unsupported file format. "
                "Supported formats: CSV, XLSX, JSON"
            ),
        )

    # --------------------------------------------------------
    # 3. Save temporary upload
    # --------------------------------------------------------

    upload_dir = Path("data/uploads")

    upload_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    file_path = upload_dir / file.filename

    try:

        contents = await file.read()

        with open(
            file_path,
            "wb",
        ) as destination:

            destination.write(contents)

        # ----------------------------------------------------
        # 4. Read file
        # ----------------------------------------------------

        df = read_file(file_path)

        # ----------------------------------------------------
        # 5. Process complete import pipeline
        # ----------------------------------------------------

        result = process_employee_import(df)

        # ----------------------------------------------------
        # 6. Return import summary
        # ----------------------------------------------------

        return {
            "filename": file.filename,
            **result,
        }

    except ValueError as exc:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )

    except Exception as exc:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Import failed: {str(exc)}",
        )

    finally:

        # ----------------------------------------------------
        # 7. Remove temporary uploaded file
        # ----------------------------------------------------

        if file_path.exists():
            file_path.unlink()