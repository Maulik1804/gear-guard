"""
Work Order API Routes
"""

from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from datetime import date
from decimal import Decimal
from pydantic import BaseModel, Field
from models.work_order import WorkOrder

router = APIRouter()


class WorkOrderBase(BaseModel):
    work_order_number: str = Field(..., min_length=1, max_length=100)
    cost: Optional[Decimal] = None
    tag: Optional[str] = Field(None, max_length=100)
    alternative_information: Optional[str] = None
    cost_per_hour: Optional[Decimal] = None
    capacity_task_estimate: Optional[Decimal] = None
    goal_target: Optional[str] = Field(None, max_length=255)
    work_center_id: Optional[int] = None
    equipment_id: Optional[int] = None
    from_date: Optional[date] = None
    to_date: Optional[date] = None
    status: str = Field(default='draft', max_length=50)
    company_id: Optional[int] = None


class WorkOrderCreate(WorkOrderBase):
    pass


class WorkOrderUpdate(BaseModel):
    work_order_number: Optional[str] = Field(None, min_length=1, max_length=100)
    cost: Optional[Decimal] = None
    tag: Optional[str] = Field(None, max_length=100)
    alternative_information: Optional[str] = None
    cost_per_hour: Optional[Decimal] = None
    capacity_task_estimate: Optional[Decimal] = None
    goal_target: Optional[str] = Field(None, max_length=255)
    work_center_id: Optional[int] = None
    equipment_id: Optional[int] = None
    from_date: Optional[date] = None
    to_date: Optional[date] = None
    status: Optional[str] = Field(None, max_length=50)
    company_id: Optional[int] = None


class WorkOrderResponse(WorkOrderBase):
    id: int
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


@router.post("/", response_model=WorkOrderResponse, status_code=status.HTTP_201_CREATED)
async def create_work_order(work_order: WorkOrderCreate):
    """Create a new work order"""
    try:
        new_work_order = WorkOrder.create(
            work_order_number=work_order.work_order_number,
            cost=work_order.cost,
            tag=work_order.tag,
            alternative_information=work_order.alternative_information,
            cost_per_hour=work_order.cost_per_hour,
            capacity_task_estimate=work_order.capacity_task_estimate,
            goal_target=work_order.goal_target,
            work_center_id=work_order.work_center_id,
            equipment_id=work_order.equipment_id,
            from_date=work_order.from_date,
            to_date=work_order.to_date,
            status=work_order.status,
            company_id=work_order.company_id
        )
        return WorkOrderResponse(
            id=new_work_order.id,
            work_order_number=new_work_order.work_order_number,
            cost=new_work_order.cost,
            tag=new_work_order.tag,
            alternative_information=new_work_order.alternative_information,
            cost_per_hour=new_work_order.cost_per_hour,
            capacity_task_estimate=new_work_order.capacity_task_estimate,
            goal_target=new_work_order.goal_target,
            work_center_id=new_work_order.work_center_id,
            equipment_id=new_work_order.equipment_id,
            from_date=new_work_order.from_date,
            to_date=new_work_order.to_date,
            status=new_work_order.status,
            company_id=new_work_order.company_id,
            created_at=str(new_work_order.created_at),
            updated_at=str(new_work_order.updated_at)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating work order: {str(e)}"
        )


@router.get("/", response_model=List[WorkOrderResponse])
async def get_work_orders():
    """Get all work orders"""
    try:
        work_orders = WorkOrder.get_all()
        return [
            WorkOrderResponse(
                id=wo.id,
                work_order_number=wo.work_order_number,
                cost=wo.cost,
                tag=wo.tag,
                alternative_information=wo.alternative_information,
                cost_per_hour=wo.cost_per_hour,
                capacity_task_estimate=wo.capacity_task_estimate,
                goal_target=wo.goal_target,
                work_center_id=wo.work_center_id,
                equipment_id=wo.equipment_id,
                from_date=wo.from_date,
                to_date=wo.to_date,
                status=wo.status,
                company_id=wo.company_id,
                created_at=str(wo.created_at),
                updated_at=str(wo.updated_at)
            )
            for wo in work_orders
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching work orders: {str(e)}"
        )


@router.get("/{work_order_id}", response_model=WorkOrderResponse)
async def get_work_order(work_order_id: int):
    """Get work order by ID"""
    work_order = WorkOrder.get_by_id(work_order_id)
    if not work_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Work order with id {work_order_id} not found"
        )
    return WorkOrderResponse(
        id=work_order.id,
        work_order_number=work_order.work_order_number,
        cost=work_order.cost,
        tag=work_order.tag,
        alternative_information=work_order.alternative_information,
        cost_per_hour=work_order.cost_per_hour,
        capacity_task_estimate=work_order.capacity_task_estimate,
        goal_target=work_order.goal_target,
        work_center_id=work_order.work_center_id,
        equipment_id=work_order.equipment_id,
        from_date=work_order.from_date,
        to_date=work_order.to_date,
        status=work_order.status,
        company_id=work_order.company_id,
        created_at=str(work_order.created_at),
        updated_at=str(work_order.updated_at)
    )


@router.put("/{work_order_id}", response_model=WorkOrderResponse)
async def update_work_order(work_order_id: int, work_order_update: WorkOrderUpdate):
    """Update work order"""
    work_order = WorkOrder.get_by_id(work_order_id)
    if not work_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Work order with id {work_order_id} not found"
        )
    
    if work_order_update.work_order_number is not None:
        work_order.work_order_number = work_order_update.work_order_number
    if work_order_update.cost is not None:
        work_order.cost = work_order_update.cost
    if work_order_update.tag is not None:
        work_order.tag = work_order_update.tag
    if work_order_update.alternative_information is not None:
        work_order.alternative_information = work_order_update.alternative_information
    if work_order_update.cost_per_hour is not None:
        work_order.cost_per_hour = work_order_update.cost_per_hour
    if work_order_update.capacity_task_estimate is not None:
        work_order.capacity_task_estimate = work_order_update.capacity_task_estimate
    if work_order_update.goal_target is not None:
        work_order.goal_target = work_order_update.goal_target
    if work_order_update.work_center_id is not None:
        work_order.work_center_id = work_order_update.work_center_id
    if work_order_update.equipment_id is not None:
        work_order.equipment_id = work_order_update.equipment_id
    if work_order_update.from_date is not None:
        work_order.from_date = work_order_update.from_date
    if work_order_update.to_date is not None:
        work_order.to_date = work_order_update.to_date
    if work_order_update.status is not None:
        work_order.status = work_order_update.status
    if work_order_update.company_id is not None:
        work_order.company_id = work_order_update.company_id
    
    updated_work_order = work_order.update()
    return WorkOrderResponse(
        id=updated_work_order.id,
        work_order_number=updated_work_order.work_order_number,
        cost=updated_work_order.cost,
        tag=updated_work_order.tag,
        alternative_information=updated_work_order.alternative_information,
        cost_per_hour=updated_work_order.cost_per_hour,
        capacity_task_estimate=updated_work_order.capacity_task_estimate,
        goal_target=updated_work_order.goal_target,
        work_center_id=updated_work_order.work_center_id,
        equipment_id=updated_work_order.equipment_id,
        from_date=updated_work_order.from_date,
        to_date=updated_work_order.to_date,
        status=updated_work_order.status,
        company_id=updated_work_order.company_id,
        created_at=str(updated_work_order.created_at),
        updated_at=str(updated_work_order.updated_at)
    )


@router.delete("/{work_order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_work_order(work_order_id: int):
    """Delete work order"""
    work_order = WorkOrder.get_by_id(work_order_id)
    if not work_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Work order with id {work_order_id} not found"
        )
    
    success = work_order.delete()
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting work order"
        )
    return None

