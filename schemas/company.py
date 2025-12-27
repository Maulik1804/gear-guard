"""
Pydantic schemas for Company (FastAPI)
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class CompanyBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)


class CompanyResponse(CompanyBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

