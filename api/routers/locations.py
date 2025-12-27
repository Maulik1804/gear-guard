"""
Location API Routes
"""

from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from pydantic import BaseModel, Field
from models.location import Location

router = APIRouter()


class LocationBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    address: Optional[str] = None
    company_id: Optional[int] = None


class LocationCreate(LocationBase):
    pass


class LocationUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    address: Optional[str] = None
    company_id: Optional[int] = None


class LocationResponse(LocationBase):
    id: int
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


@router.post("/", response_model=LocationResponse, status_code=status.HTTP_201_CREATED)
async def create_location(location: LocationCreate):
    """Create a new location"""
    try:
        new_location = Location.create(
            name=location.name,
            address=location.address,
            company_id=location.company_id
        )
        return LocationResponse(
            id=new_location.id,
            name=new_location.name,
            address=new_location.address,
            company_id=new_location.company_id,
            created_at=str(new_location.created_at),
            updated_at=str(new_location.updated_at)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating location: {str(e)}"
        )


@router.get("/", response_model=List[LocationResponse])
async def get_locations():
    """Get all locations"""
    try:
        locations = Location.get_all()
        return [
            LocationResponse(
                id=l.id,
                name=l.name,
                address=l.address,
                company_id=l.company_id,
                created_at=str(l.created_at),
                updated_at=str(l.updated_at)
            )
            for l in locations
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching locations: {str(e)}"
        )


@router.get("/{location_id}", response_model=LocationResponse)
async def get_location(location_id: int):
    """Get location by ID"""
    location = Location.get_by_id(location_id)
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Location with id {location_id} not found"
        )
    return LocationResponse(
        id=location.id,
        name=location.name,
        address=location.address,
        company_id=location.company_id,
        created_at=str(location.created_at),
        updated_at=str(location.updated_at)
    )


@router.put("/{location_id}", response_model=LocationResponse)
async def update_location(location_id: int, location_update: LocationUpdate):
    """Update location"""
    location = Location.get_by_id(location_id)
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Location with id {location_id} not found"
        )
    
    if location_update.name is not None:
        location.name = location_update.name
    if location_update.address is not None:
        location.address = location_update.address
    if location_update.company_id is not None:
        location.company_id = location_update.company_id
    
    updated_location = location.update()
    return LocationResponse(
        id=updated_location.id,
        name=updated_location.name,
        address=updated_location.address,
        company_id=updated_location.company_id,
        created_at=str(updated_location.created_at),
        updated_at=str(updated_location.updated_at)
    )


@router.delete("/{location_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_location(location_id: int):
    """Delete location"""
    location = Location.get_by_id(location_id)
    if not location:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Location with id {location_id} not found"
        )
    
    success = location.delete()
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting location"
        )
    return None

