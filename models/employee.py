"""
Employee Model using psycopg2
"""

from datetime import datetime
from typing import Optional, List
from models.db import get_db_cursor


class Employee:
    def __init__(self, id: Optional[int] = None, user_id: Optional[int] = None,
                 employee_code: Optional[str] = None, company_id: Optional[int] = None,
                 department: Optional[str] = None, position: Optional[str] = None,
                 created_at: Optional[datetime] = None, 
                 updated_at: Optional[datetime] = None):
        self.id = id
        self.user_id = user_id
        self.employee_code = employee_code
        self.company_id = company_id
        self.department = department
        self.position = position
        self.created_at = created_at
        self.updated_at = updated_at

    @staticmethod
    def create(user_id: Optional[int] = None, employee_code: Optional[str] = None,
               company_id: Optional[int] = None, department: Optional[str] = None,
               position: Optional[str] = None) -> 'Employee':
        """Create a new employee"""
        with get_db_cursor() as cursor:
            cursor.execute(
                """INSERT INTO employees (user_id, employee_code, company_id, department, position, created_at, updated_at) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING *""",
                (user_id, employee_code, company_id, department, position, datetime.utcnow(), datetime.utcnow())
            )
            result = cursor.fetchone()
            return Employee(**dict(result))

    @staticmethod
    def get_by_id(employee_id: int) -> Optional['Employee']:
        """Get employee by ID"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM employees WHERE id = %s", (employee_id,))
            result = cursor.fetchone()
            return Employee(**dict(result)) if result else None

    @staticmethod
    def get_by_user_id(user_id: int) -> Optional['Employee']:
        """Get employee by user ID"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM employees WHERE user_id = %s", (user_id,))
            result = cursor.fetchone()
            return Employee(**dict(result)) if result else None

    @staticmethod
    def get_all() -> List['Employee']:
        """Get all employees"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM employees ORDER BY created_at DESC")
            results = cursor.fetchall()
            return [Employee(**dict(row)) for row in results]

    def update(self) -> 'Employee':
        """Update employee"""
        if not self.id:
            raise ValueError("Employee ID is required for update")
        with get_db_cursor() as cursor:
            cursor.execute(
                """UPDATE employees SET user_id = %s, employee_code = %s, company_id = %s, 
                   department = %s, position = %s, updated_at = %s WHERE id = %s RETURNING *""",
                (self.user_id, self.employee_code, self.company_id, self.department, 
                 self.position, datetime.utcnow(), self.id)
            )
            result = cursor.fetchone()
            return Employee(**dict(result))

    def delete(self) -> bool:
        """Delete employee"""
        if not self.id:
            raise ValueError("Employee ID is required for delete")
        with get_db_cursor() as cursor:
            cursor.execute("DELETE FROM employees WHERE id = %s", (self.id,))
            return cursor.rowcount > 0

