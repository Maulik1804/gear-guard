"""
Task API Routes
"""

from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from datetime import date
from pydantic import BaseModel, Field
from models.task import TaskType, Task, WorkOrderTask

router = APIRouter()


# Task Type schemas
class TaskTypeBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    company_id: Optional[int] = None


class TaskTypeCreate(TaskTypeBase):
    pass


class TaskTypeResponse(TaskTypeBase):
    id: int
    created_at: str

    class Config:
        from_attributes = True


# Task schemas
class TaskBase(BaseModel):
    task_activity: str = Field(..., min_length=1, max_length=255)
    type_id: Optional[int] = None
    subject_apartment: Optional[str] = Field(None, max_length=255)
    assigned_to_id: Optional[int] = None
    schedule_date: Optional[date] = None
    location_id: Optional[int] = None
    priority: str = Field(default='medium', max_length=50)
    maintenance_type_id: Optional[int] = None
    description: Optional[str] = None
    work_order_id: Optional[int] = None
    request_created_for_new_type: bool = False
    status: str = Field(default='pending', max_length=50)
    company_id: Optional[int] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    task_activity: Optional[str] = Field(None, min_length=1, max_length=255)
    type_id: Optional[int] = None
    subject_apartment: Optional[str] = Field(None, max_length=255)
    assigned_to_id: Optional[int] = None
    schedule_date: Optional[date] = None
    location_id: Optional[int] = None
    priority: Optional[str] = Field(None, max_length=50)
    maintenance_type_id: Optional[int] = None
    description: Optional[str] = None
    work_order_id: Optional[int] = None
    request_created_for_new_type: Optional[bool] = None
    status: Optional[str] = Field(None, max_length=50)
    company_id: Optional[int] = None


class TaskResponse(TaskBase):
    id: int
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


# Work Order Task schemas
class WorkOrderTaskBase(BaseModel):
    work_order_id: int
    task_id: int


class WorkOrderTaskCreate(WorkOrderTaskBase):
    pass


class WorkOrderTaskResponse(WorkOrderTaskBase):
    id: int
    created_at: str

    class Config:
        from_attributes = True


# Task Type endpoints
@router.post("/types", response_model=TaskTypeResponse, status_code=status.HTTP_201_CREATED)
async def create_task_type(task_type: TaskTypeCreate):
    """Create a new task type"""
    try:
        new_task_type = TaskType.create(
            name=task_type.name,
            company_id=task_type.company_id
        )
        return TaskTypeResponse(
            id=new_task_type.id,
            name=new_task_type.name,
            company_id=new_task_type.company_id,
            created_at=str(new_task_type.created_at)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating task type: {str(e)}"
        )


@router.get("/types", response_model=List[TaskTypeResponse])
async def get_task_types():
    """Get all task types"""
    try:
        task_types = TaskType.get_all()
        return [
            TaskTypeResponse(
                id=tt.id,
                name=tt.name,
                company_id=tt.company_id,
                created_at=str(tt.created_at)
            )
            for tt in task_types
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching task types: {str(e)}"
        )


# Task endpoints
@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(task: TaskCreate):
    """Create a new task"""
    try:
        new_task = Task.create(
            task_activity=task.task_activity,
            type_id=task.type_id,
            subject_apartment=task.subject_apartment,
            assigned_to_id=task.assigned_to_id,
            schedule_date=task.schedule_date,
            location_id=task.location_id,
            priority=task.priority,
            maintenance_type_id=task.maintenance_type_id,
            description=task.description,
            work_order_id=task.work_order_id,
            request_created_for_new_type=task.request_created_for_new_type,
            status=task.status,
            company_id=task.company_id
        )
        return TaskResponse(
            id=new_task.id,
            task_activity=new_task.task_activity,
            type_id=new_task.type_id,
            subject_apartment=new_task.subject_apartment,
            assigned_to_id=new_task.assigned_to_id,
            schedule_date=new_task.schedule_date,
            location_id=new_task.location_id,
            priority=new_task.priority,
            maintenance_type_id=new_task.maintenance_type_id,
            description=new_task.description,
            work_order_id=new_task.work_order_id,
            request_created_for_new_type=new_task.request_created_for_new_type,
            status=new_task.status,
            company_id=new_task.company_id,
            created_at=str(new_task.created_at),
            updated_at=str(new_task.updated_at)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating task: {str(e)}"
        )


@router.get("/", response_model=List[TaskResponse])
async def get_tasks():
    """Get all tasks"""
    try:
        tasks = Task.get_all()
        return [
            TaskResponse(
                id=t.id,
                task_activity=t.task_activity,
                type_id=t.type_id,
                subject_apartment=t.subject_apartment,
                assigned_to_id=t.assigned_to_id,
                schedule_date=t.schedule_date,
                location_id=t.location_id,
                priority=t.priority,
                maintenance_type_id=t.maintenance_type_id,
                description=t.description,
                work_order_id=t.work_order_id,
                request_created_for_new_type=t.request_created_for_new_type,
                status=t.status,
                company_id=t.company_id,
                created_at=str(t.created_at),
                updated_at=str(t.updated_at)
            )
            for t in tasks
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching tasks: {str(e)}"
        )


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(task_id: int):
    """Get task by ID"""
    task = Task.get_by_id(task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found"
        )
    return TaskResponse(
        id=task.id,
        task_activity=task.task_activity,
        type_id=task.type_id,
        subject_apartment=task.subject_apartment,
        assigned_to_id=task.assigned_to_id,
        schedule_date=task.schedule_date,
        location_id=task.location_id,
        priority=task.priority,
        maintenance_type_id=task.maintenance_type_id,
        description=task.description,
        work_order_id=task.work_order_id,
        request_created_for_new_type=task.request_created_for_new_type,
        status=task.status,
        company_id=task.company_id,
        created_at=str(task.created_at),
        updated_at=str(task.updated_at)
    )


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: int, task_update: TaskUpdate):
    """Update task"""
    task = Task.get_by_id(task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found"
        )
    
    # Update fields if provided
    for field, value in task_update.dict(exclude_unset=True).items():
        setattr(task, field, value)
    
    updated_task = task.update()
    return TaskResponse(
        id=updated_task.id,
        task_activity=updated_task.task_activity,
        type_id=updated_task.type_id,
        subject_apartment=updated_task.subject_apartment,
        assigned_to_id=updated_task.assigned_to_id,
        schedule_date=updated_task.schedule_date,
        location_id=updated_task.location_id,
        priority=updated_task.priority,
        maintenance_type_id=updated_task.maintenance_type_id,
        description=updated_task.description,
        work_order_id=updated_task.work_order_id,
        request_created_for_new_type=updated_task.request_created_for_new_type,
        status=updated_task.status,
        company_id=updated_task.company_id,
        created_at=str(updated_task.created_at),
        updated_at=str(updated_task.updated_at)
    )


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: int):
    """Delete task"""
    task = Task.get_by_id(task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found"
        )
    
    success = task.delete()
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting task"
        )
    return None


# Work Order Task endpoints
@router.post("/work-order-tasks", response_model=WorkOrderTaskResponse, status_code=status.HTTP_201_CREATED)
async def create_work_order_task(work_order_task: WorkOrderTaskCreate):
    """Link task to work order"""
    try:
        new_link = WorkOrderTask.create(
            work_order_id=work_order_task.work_order_id,
            task_id=work_order_task.task_id
        )
        return WorkOrderTaskResponse(
            id=new_link.id,
            work_order_id=new_link.work_order_id,
            task_id=new_link.task_id,
            created_at=str(new_link.created_at)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error linking task to work order: {str(e)}"
        )


@router.get("/work-orders/{work_order_id}/tasks", response_model=List[WorkOrderTaskResponse])
async def get_work_order_tasks(work_order_id: int):
    """Get all tasks for a work order"""
    try:
        links = WorkOrderTask.get_by_work_order(work_order_id)
        return [
            WorkOrderTaskResponse(
                id=link.id,
                work_order_id=link.work_order_id,
                task_id=link.task_id,
                created_at=str(link.created_at)
            )
            for link in links
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching work order tasks: {str(e)}"
        )

