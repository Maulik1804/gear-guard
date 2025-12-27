"""
Pydantic schemas for Team (FastAPI)
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class TeamBase(BaseModel):
    team_name: str = Field(..., min_length=1, max_length=255)
    team_leader_id: Optional[int] = None
    company_id: Optional[int] = None


class TeamCreate(TeamBase):
    pass


class TeamUpdate(BaseModel):
    team_name: Optional[str] = Field(None, min_length=1, max_length=255)
    team_leader_id: Optional[int] = None
    company_id: Optional[int] = None


class TeamResponse(TeamBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TeamMemberBase(BaseModel):
    team_id: int
    employee_id: int


class TeamMemberCreate(TeamMemberBase):
    pass


class TeamMemberResponse(TeamMemberBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

