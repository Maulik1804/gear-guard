"""
Work Center API Routes
"""

from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from pydantic import BaseModel, Field
from models.work_center import WorkCenter

router = APIRouter()


class WorkCenterBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    work_center_group: Optional[str] = Field(None, max_length=255)
    company_id: Optional[int] = None


class WorkCenterCreate(WorkCenterBase):
    pass


class WorkCenterUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    work_center_group: Optional[str] = Field(None, max_length=255)
    company_id: Optional[int] = None


class WorkCenterResponse(WorkCenterBase):
    id: int
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


@router.post("/", response_model=WorkCenterResponse, status_code=status.HTTP_201_CREATED)
async def create_work_center(work_center: WorkCenterCreate):
    """Create a new work center"""
    try:
        new_work_center = WorkCenter.create(
            name=work_center.name,
            work_center_group=work_center.work_center_group,
            company_id=work_center.company_id
        )
        return WorkCenterResponse(
            id=new_work_center.id,
            name=new_work_center.name,
            work_center_group=new_work_center.work_center_group,
            company_id=new_work_center.company_id,
            created_at=str(new_work_center.created_at),
            updated_at=str(new_work_center.updated_at)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating work center: {str(e)}"
        )


@router.get("/", response_model=List[WorkCenterResponse])
async def get_work_centers():
    """Get all work centers"""
    try:
        work_centers = WorkCenter.get_all()
        return [
            WorkCenterResponse(
                id=wc.id,
                name=wc.name,
                work_center_group=wc.work_center_group,
                company_id=wc.company_id,
                created_at=str(wc.created_at),
                updated_at=str(wc.updated_at)
            )
            for wc in work_centers
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching work centers: {str(e)}"
        )


@router.get("/{work_center_id}", response_model=WorkCenterResponse)
async def get_work_center(work_center_id: int):
    """Get work center by ID"""
    work_center = WorkCenter.get_by_id(work_center_id)
    if not work_center:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Work center with id {work_center_id} not found"
        )
    return WorkCenterResponse(
        id=work_center.id,
        name=work_center.name,
        work_center_group=work_center.work_center_group,
        company_id=work_center.company_id,
        created_at=str(work_center.created_at),
        updated_at=str(work_center.updated_at)
    )


@router.put("/{work_center_id}", response_model=WorkCenterResponse)
async def update_work_center(work_center_id: int, work_center_update: WorkCenterUpdate):
    """Update work center"""
    work_center = WorkCenter.get_by_id(work_center_id)
    if not work_center:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Work center with id {work_center_id} not found"
        )
    
    if work_center_update.name is not None:
        work_center.name = work_center_update.name
    if work_center_update.work_center_group is not None:
        work_center.work_center_group = work_center_update.work_center_group
    if work_center_update.company_id is not None:
        work_center.company_id = work_center_update.company_id
    
    updated_work_center = work_center.update()
    return WorkCenterResponse(
        id=updated_work_center.id,
        name=updated_work_center.name,
        work_center_group=updated_work_center.work_center_group,
        company_id=updated_work_center.company_id,
        created_at=str(updated_work_center.created_at),
        updated_at=str(updated_work_center.updated_at)
    )


@router.delete("/{work_center_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_work_center(work_center_id: int):
    """Delete work center"""
    work_center = WorkCenter.get_by_id(work_center_id)
    if not work_center:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Work center with id {work_center_id} not found"
        )
    
    success = work_center.delete()
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting work center"
        )
    return None

