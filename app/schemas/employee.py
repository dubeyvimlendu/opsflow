from datetime import date

from pydantic import BaseModel, EmailStr, Field


class EmployeeBase(BaseModel):
    employee_code: str = Field(
        pattern=r"^EMP\d{4}$"
    )

    first_name: str = Field(
        min_length=1,
        max_length=50
    )

    last_name: str = Field(
        min_length=1,
        max_length=50
    )

    email: EmailStr

    department: str = Field(
        min_length=1,
        max_length=50
    )

    designation: str = Field(
        min_length=1,
        max_length=100
    )

    salary: float = Field(
        gt=0
    )

    joining_date: date

    status: str


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeResponse(EmployeeBase):
    id: int

    model_config = {
        "from_attributes": True
    }