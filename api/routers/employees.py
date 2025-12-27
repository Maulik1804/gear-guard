"""
Employee API Routes
"""

from fastapi import APIRouter, HTTPException, status
from typing import List
from models.employee import Employee
from schemas.employee import EmployeeCreate, EmployeeUpdate, EmployeeResponse

router = APIRouter()


@router.post("/", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(employee: EmployeeCreate):
    """Create a new employee"""
    try:
        new_employee = Employee.create(
            user_id=employee.user_id,
            employee_code=employee.employee_code,
            company_id=employee.company_id,
            department=employee.department,
            position=employee.position
        )
        return EmployeeResponse(
            id=new_employee.id,
            user_id=new_employee.user_id,
            employee_code=new_employee.employee_code,
            company_id=new_employee.company_id,
            department=new_employee.department,
            position=new_employee.position,
            created_at=new_employee.created_at,
            updated_at=new_employee.updated_at
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating employee: {str(e)}"
        )


@router.get("/", response_model=List[EmployeeResponse])
async def get_employees():
    """Get all employees"""
    try:
        employees = Employee.get_all()
        return [
            EmployeeResponse(
                id=e.id,
                user_id=e.user_id,
                employee_code=e.employee_code,
                company_id=e.company_id,
                department=e.department,
                position=e.position,
                created_at=e.created_at,
                updated_at=e.updated_at
            )
            for e in employees
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching employees: {str(e)}"
        )


@router.get("/{employee_id}", response_model=EmployeeResponse)
async def get_employee(employee_id: int):
    """Get employee by ID"""
    employee = Employee.get_by_id(employee_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with id {employee_id} not found"
        )
    return EmployeeResponse(
        id=employee.id,
        user_id=employee.user_id,
        employee_code=employee.employee_code,
        company_id=employee.company_id,
        department=employee.department,
        position=employee.position,
        created_at=employee.created_at,
        updated_at=employee.updated_at
    )


@router.get("/user/{user_id}", response_model=EmployeeResponse)
async def get_employee_by_user(user_id: int):
    """Get employee by user ID"""
    employee = Employee.get_by_user_id(user_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with user_id {user_id} not found"
        )
    return EmployeeResponse(
        id=employee.id,
        user_id=employee.user_id,
        employee_code=employee.employee_code,
        company_id=employee.company_id,
        department=employee.department,
        position=employee.position,
        created_at=employee.created_at,
        updated_at=employee.updated_at
    )


@router.put("/{employee_id}", response_model=EmployeeResponse)
async def update_employee(employee_id: int, employee_update: EmployeeUpdate):
    """Update employee"""
    employee = Employee.get_by_id(employee_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with id {employee_id} not found"
        )
    
    if employee_update.user_id is not None:
        employee.user_id = employee_update.user_id
    if employee_update.employee_code is not None:
        employee.employee_code = employee_update.employee_code
    if employee_update.company_id is not None:
        employee.company_id = employee_update.company_id
    if employee_update.department is not None:
        employee.department = employee_update.department
    if employee_update.position is not None:
        employee.position = employee_update.position
    
    updated_employee = employee.update()
    return EmployeeResponse(
        id=updated_employee.id,
        user_id=updated_employee.user_id,
        employee_code=updated_employee.employee_code,
        company_id=updated_employee.company_id,
        department=updated_employee.department,
        position=updated_employee.position,
        created_at=updated_employee.created_at,
        updated_at=updated_employee.updated_at
    )


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(employee_id: int):
    """Delete employee"""
    employee = Employee.get_by_id(employee_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with id {employee_id} not found"
        )
    
    success = employee.delete()
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting employee"
        )
    return None

