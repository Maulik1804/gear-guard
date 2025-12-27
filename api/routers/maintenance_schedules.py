"""
Maintenance Schedule API Routes
"""

from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from datetime import date, time
from decimal import Decimal
from pydantic import BaseModel, Field
from models.maintenance_schedule import MaintenanceSchedule

router = APIRouter()


class MaintenanceScheduleBase(BaseModel):
    equipment_id: Optional[int] = None
    task_id: Optional[int] = None
    work_order_id: Optional[int] = None
    scheduled_date: date
    scheduled_time: Optional[time] = None
    duration_hours: Optional[Decimal] = None
    assigned_to_id: Optional[int] = None
    status: str = Field(default='scheduled', max_length=50)
    notes: Optional[str] = None
    company_id: Optional[int] = None


class MaintenanceScheduleCreate(MaintenanceScheduleBase):
    pass


class MaintenanceScheduleUpdate(BaseModel):
    equipment_id: Optional[int] = None
    task_id: Optional[int] = None
    work_order_id: Optional[int] = None
    scheduled_date: Optional[date] = None
    scheduled_time: Optional[time] = None
    duration_hours: Optional[Decimal] = None
    assigned_to_id: Optional[int] = None
    status: Optional[str] = Field(None, max_length=50)
    notes: Optional[str] = None
    company_id: Optional[int] = None


class MaintenanceScheduleResponse(MaintenanceScheduleBase):
    id: int
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


@router.post("/", response_model=MaintenanceScheduleResponse, status_code=status.HTTP_201_CREATED)
async def create_maintenance_schedule(schedule: MaintenanceScheduleCreate):
    """Create a new maintenance schedule"""
    try:
        new_schedule = MaintenanceSchedule.create(
            equipment_id=schedule.equipment_id,
            task_id=schedule.task_id,
            work_order_id=schedule.work_order_id,
            scheduled_date=schedule.scheduled_date,
            scheduled_time=schedule.scheduled_time,
            duration_hours=schedule.duration_hours,
            assigned_to_id=schedule.assigned_to_id,
            status=schedule.status,
            notes=schedule.notes,
            company_id=schedule.company_id
        )
        return MaintenanceScheduleResponse(
            id=new_schedule.id,
            equipment_id=new_schedule.equipment_id,
            task_id=new_schedule.task_id,
            work_order_id=new_schedule.work_order_id,
            scheduled_date=new_schedule.scheduled_date,
            scheduled_time=new_schedule.scheduled_time,
            duration_hours=new_schedule.duration_hours,
            assigned_to_id=new_schedule.assigned_to_id,
            status=new_schedule.status,
            notes=new_schedule.notes,
            company_id=new_schedule.company_id,
            created_at=str(new_schedule.created_at),
            updated_at=str(new_schedule.updated_at)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating maintenance schedule: {str(e)}"
        )


@router.get("/", response_model=List[MaintenanceScheduleResponse])
async def get_maintenance_schedules():
    """Get all maintenance schedules"""
    try:
        schedules = MaintenanceSchedule.get_all()
        return [
            MaintenanceScheduleResponse(
                id=s.id,
                equipment_id=s.equipment_id,
                task_id=s.task_id,
                work_order_id=s.work_order_id,
                scheduled_date=s.scheduled_date,
                scheduled_time=s.scheduled_time,
                duration_hours=s.duration_hours,
                assigned_to_id=s.assigned_to_id,
                status=s.status,
                notes=s.notes,
                company_id=s.company_id,
                created_at=str(s.created_at),
                updated_at=str(s.updated_at)
            )
            for s in schedules
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching maintenance schedules: {str(e)}"
        )


@router.get("/{schedule_id}", response_model=MaintenanceScheduleResponse)
async def get_maintenance_schedule(schedule_id: int):
    """Get maintenance schedule by ID"""
    schedule = MaintenanceSchedule.get_by_id(schedule_id)
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Maintenance schedule with id {schedule_id} not found"
        )
    return MaintenanceScheduleResponse(
        id=schedule.id,
        equipment_id=schedule.equipment_id,
        task_id=schedule.task_id,
        work_order_id=schedule.work_order_id,
        scheduled_date=schedule.scheduled_date,
        scheduled_time=schedule.scheduled_time,
        duration_hours=schedule.duration_hours,
        assigned_to_id=schedule.assigned_to_id,
        status=schedule.status,
        notes=schedule.notes,
        company_id=schedule.company_id,
        created_at=str(schedule.created_at),
        updated_at=str(schedule.updated_at)
    )


@router.get("/date-range/{start_date}/{end_date}", response_model=List[MaintenanceScheduleResponse])
async def get_schedules_by_date_range(start_date: date, end_date: date):
    """Get maintenance schedules by date range"""
    try:
        schedules = MaintenanceSchedule.get_by_date_range(start_date, end_date)
        return [
            MaintenanceScheduleResponse(
                id=s.id,
                equipment_id=s.equipment_id,
                task_id=s.task_id,
                work_order_id=s.work_order_id,
                scheduled_date=s.scheduled_date,
                scheduled_time=s.scheduled_time,
                duration_hours=s.duration_hours,
                assigned_to_id=s.assigned_to_id,
                status=s.status,
                notes=s.notes,
                company_id=s.company_id,
                created_at=str(s.created_at),
                updated_at=str(s.updated_at)
            )
            for s in schedules
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching maintenance schedules: {str(e)}"
        )


@router.put("/{schedule_id}", response_model=MaintenanceScheduleResponse)
async def update_maintenance_schedule(schedule_id: int, schedule_update: MaintenanceScheduleUpdate):
    """Update maintenance schedule"""
    schedule = MaintenanceSchedule.get_by_id(schedule_id)
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Maintenance schedule with id {schedule_id} not found"
        )
    
    # Update fields if provided
    for field, value in schedule_update.dict(exclude_unset=True).items():
        setattr(schedule, field, value)
    
    updated_schedule = schedule.update()
    return MaintenanceScheduleResponse(
        id=updated_schedule.id,
        equipment_id=updated_schedule.equipment_id,
        task_id=updated_schedule.task_id,
        work_order_id=updated_schedule.work_order_id,
        scheduled_date=updated_schedule.scheduled_date,
        scheduled_time=updated_schedule.scheduled_time,
        duration_hours=updated_schedule.duration_hours,
        assigned_to_id=updated_schedule.assigned_to_id,
        status=updated_schedule.status,
        notes=updated_schedule.notes,
        company_id=updated_schedule.company_id,
        created_at=str(updated_schedule.created_at),
        updated_at=str(updated_schedule.updated_at)
    )


@router.delete("/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_maintenance_schedule(schedule_id: int):
    """Delete maintenance schedule"""
    schedule = MaintenanceSchedule.get_by_id(schedule_id)
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Maintenance schedule with id {schedule_id} not found"
        )
    
    success = schedule.delete()
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting maintenance schedule"
        )
    return None

