"""
Equipment API Routes
"""

from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from datetime import date
from models.equipment import EquipmentCategory, MaintenanceType, Equipment
from pydantic import BaseModel, Field

router = APIRouter()


# Equipment Category schemas
class EquipmentCategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    responsible_id: Optional[int] = None
    company_id: Optional[int] = None


class EquipmentCategoryCreate(EquipmentCategoryBase):
    pass


class EquipmentCategoryResponse(EquipmentCategoryBase):
    id: int
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


# Maintenance Type schemas
class MaintenanceTypeBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    company_id: Optional[int] = None


class MaintenanceTypeCreate(MaintenanceTypeBase):
    pass


class MaintenanceTypeResponse(MaintenanceTypeBase):
    id: int
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


# Equipment schemas
class EquipmentBase(BaseModel):
    equipment_name: str = Field(..., min_length=1, max_length=255)
    type_model: Optional[str] = Field(None, max_length=255)
    equipment_category_id: Optional[int] = None
    company_id: Optional[int] = None
    used_by_id: Optional[int] = None
    used_in_location_id: Optional[int] = None
    maintenance_type_id: Optional[int] = None
    assigned_date: Optional[date] = None
    stop_date: Optional[date] = None
    description: Optional[str] = None
    status: str = Field(default='active', max_length=50)


class EquipmentCreate(EquipmentBase):
    pass


class EquipmentResponse(EquipmentBase):
    id: int
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


# Equipment Category endpoints
@router.post("/categories", response_model=EquipmentCategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_equipment_category(category: EquipmentCategoryCreate):
    """Create a new equipment category"""
    try:
        new_category = EquipmentCategory.create(
            name=category.name,
            responsible_id=category.responsible_id,
            company_id=category.company_id
        )
        return EquipmentCategoryResponse(
            id=new_category.id,
            name=new_category.name,
            responsible_id=new_category.responsible_id,
            company_id=new_category.company_id,
            created_at=str(new_category.created_at),
            updated_at=str(new_category.updated_at)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating equipment category: {str(e)}"
        )


@router.get("/categories", response_model=List[EquipmentCategoryResponse])
async def get_equipment_categories():
    """Get all equipment categories"""
    try:
        categories = EquipmentCategory.get_all()
        return [
            EquipmentCategoryResponse(
                id=c.id,
                name=c.name,
                responsible_id=c.responsible_id,
                company_id=c.company_id,
                created_at=str(c.created_at),
                updated_at=str(c.updated_at)
            )
            for c in categories
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching equipment categories: {str(e)}"
        )


# Maintenance Type endpoints
@router.post("/maintenance-types", response_model=MaintenanceTypeResponse, status_code=status.HTTP_201_CREATED)
async def create_maintenance_type(maintenance_type: MaintenanceTypeCreate):
    """Create a new maintenance type"""
    try:
        new_type = MaintenanceType.create(
            name=maintenance_type.name,
            description=maintenance_type.description,
            company_id=maintenance_type.company_id
        )
        return MaintenanceTypeResponse(
            id=new_type.id,
            name=new_type.name,
            description=new_type.description,
            company_id=new_type.company_id,
            created_at=str(new_type.created_at),
            updated_at=str(new_type.updated_at)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating maintenance type: {str(e)}"
        )


@router.get("/maintenance-types", response_model=List[MaintenanceTypeResponse])
async def get_maintenance_types():
    """Get all maintenance types"""
    try:
        types = MaintenanceType.get_all()
        return [
            MaintenanceTypeResponse(
                id=t.id,
                name=t.name,
                description=t.description,
                company_id=t.company_id,
                created_at=str(t.created_at),
                updated_at=str(t.updated_at)
            )
            for t in types
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching maintenance types: {str(e)}"
        )


# Equipment endpoints
@router.post("/", response_model=EquipmentResponse, status_code=status.HTTP_201_CREATED)
async def create_equipment(equipment: EquipmentCreate):
    """Create a new equipment"""
    try:
        new_equipment = Equipment.create(
            equipment_name=equipment.equipment_name,
            type_model=equipment.type_model,
            equipment_category_id=equipment.equipment_category_id,
            company_id=equipment.company_id,
            used_by_id=equipment.used_by_id,
            used_in_location_id=equipment.used_in_location_id,
            maintenance_type_id=equipment.maintenance_type_id,
            assigned_date=equipment.assigned_date,
            stop_date=equipment.stop_date,
            description=equipment.description,
            status=equipment.status
        )
        return EquipmentResponse(
            id=new_equipment.id,
            equipment_name=new_equipment.equipment_name,
            type_model=new_equipment.type_model,
            equipment_category_id=new_equipment.equipment_category_id,
            company_id=new_equipment.company_id,
            used_by_id=new_equipment.used_by_id,
            used_in_location_id=new_equipment.used_in_location_id,
            maintenance_type_id=new_equipment.maintenance_type_id,
            assigned_date=new_equipment.assigned_date,
            stop_date=new_equipment.stop_date,
            description=new_equipment.description,
            status=new_equipment.status,
            created_at=str(new_equipment.created_at),
            updated_at=str(new_equipment.updated_at)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating equipment: {str(e)}"
        )


@router.get("/", response_model=List[EquipmentResponse])
async def get_equipment():
    """Get all equipment"""
    try:
        equipment_list = Equipment.get_all()
        return [
            EquipmentResponse(
                id=e.id,
                equipment_name=e.equipment_name,
                type_model=e.type_model,
                equipment_category_id=e.equipment_category_id,
                company_id=e.company_id,
                used_by_id=e.used_by_id,
                used_in_location_id=e.used_in_location_id,
                maintenance_type_id=e.maintenance_type_id,
                assigned_date=e.assigned_date,
                stop_date=e.stop_date,
                description=e.description,
                status=e.status,
                created_at=str(e.created_at),
                updated_at=str(e.updated_at)
            )
            for e in equipment_list
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching equipment: {str(e)}"
        )


@router.get("/{equipment_id}", response_model=EquipmentResponse)
async def get_equipment_by_id(equipment_id: int):
    """Get equipment by ID"""
    equipment = Equipment.get_by_id(equipment_id)
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Equipment with id {equipment_id} not found"
        )
    return EquipmentResponse(
        id=equipment.id,
        equipment_name=equipment.equipment_name,
        type_model=equipment.type_model,
        equipment_category_id=equipment.equipment_category_id,
        company_id=equipment.company_id,
        used_by_id=equipment.used_by_id,
        used_in_location_id=equipment.used_in_location_id,
        maintenance_type_id=equipment.maintenance_type_id,
        assigned_date=equipment.assigned_date,
        stop_date=equipment.stop_date,
        description=equipment.description,
        status=equipment.status,
        created_at=str(equipment.created_at),
        updated_at=str(equipment.updated_at)
    )

