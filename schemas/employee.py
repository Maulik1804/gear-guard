"""
Pydantic schemas for Employee (FastAPI)
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class EmployeeBase(BaseModel):
    user_id: Optional[int] = None
    employee_code: Optional[str] = Field(None, max_length=100)
    company_id: Optional[int] = None
    department: Optional[str] = Field(None, max_length=100)
    position: Optional[str] = Field(None, max_length=100)


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    user_id: Optional[int] = None
    employee_code: Optional[str] = Field(None, max_length=100)
    company_id: Optional[int] = None
    department: Optional[str] = Field(None, max_length=100)
    position: Optional[str] = Field(None, max_length=100)


class EmployeeResponse(EmployeeBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

