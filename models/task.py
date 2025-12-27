"""
Task Models using psycopg2
"""

from datetime import datetime, date
from typing import Optional, List
from models.db import get_db_cursor


class TaskType:
    def __init__(self, id: Optional[int] = None, name: str = None,
                 company_id: Optional[int] = None,
                 created_at: Optional[datetime] = None):
        self.id = id
        self.name = name
        self.company_id = company_id
        self.created_at = created_at

    @staticmethod
    def create(name: str, company_id: Optional[int] = None) -> 'TaskType':
        """Create a new task type"""
        with get_db_cursor() as cursor:
            cursor.execute(
                "INSERT INTO task_types (name, company_id, created_at) VALUES (%s, %s, %s) RETURNING *",
                (name, company_id, datetime.utcnow())
            )
            result = cursor.fetchone()
            return TaskType(**dict(result))

    @staticmethod
    def get_by_id(task_type_id: int) -> Optional['TaskType']:
        """Get task type by ID"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM task_types WHERE id = %s", (task_type_id,))
            result = cursor.fetchone()
            return TaskType(**dict(result)) if result else None

    @staticmethod
    def get_all() -> List['TaskType']:
        """Get all task types"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM task_types ORDER BY created_at DESC")
            results = cursor.fetchall()
            return [TaskType(**dict(row)) for row in results]


class Task:
    def __init__(self, id: Optional[int] = None, task_activity: str = None,
                 type_id: Optional[int] = None, subject_apartment: Optional[str] = None,
                 assigned_to_id: Optional[int] = None, schedule_date: Optional[date] = None,
                 location_id: Optional[int] = None, priority: str = 'medium',
                 maintenance_type_id: Optional[int] = None, description: Optional[str] = None,
                 work_order_id: Optional[int] = None,
                 request_created_for_new_type: bool = False, status: str = 'pending',
                 company_id: Optional[int] = None,
                 created_at: Optional[datetime] = None, 
                 updated_at: Optional[datetime] = None):
        self.id = id
        self.task_activity = task_activity
        self.type_id = type_id
        self.subject_apartment = subject_apartment
        self.assigned_to_id = assigned_to_id
        self.schedule_date = schedule_date
        self.location_id = location_id
        self.priority = priority
        self.maintenance_type_id = maintenance_type_id
        self.description = description
        self.work_order_id = work_order_id
        self.request_created_for_new_type = request_created_for_new_type
        self.status = status
        self.company_id = company_id
        self.created_at = created_at
        self.updated_at = updated_at

    @staticmethod
    def create(task_activity: str, type_id: Optional[int] = None,
               subject_apartment: Optional[str] = None, assigned_to_id: Optional[int] = None,
               schedule_date: Optional[date] = None, location_id: Optional[int] = None,
               priority: str = 'medium', maintenance_type_id: Optional[int] = None,
               description: Optional[str] = None, work_order_id: Optional[int] = None,
               request_created_for_new_type: bool = False, status: str = 'pending',
               company_id: Optional[int] = None) -> 'Task':
        """Create a new task"""
        with get_db_cursor() as cursor:
            cursor.execute(
                """INSERT INTO tasks (task_activity, type_id, subject_apartment, assigned_to_id, 
                   schedule_date, location_id, priority, maintenance_type_id, description, work_order_id, 
                   request_created_for_new_type, status, company_id, created_at, updated_at) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING *""",
                (task_activity, type_id, subject_apartment, assigned_to_id, schedule_date,
                 location_id, priority, maintenance_type_id, description, work_order_id,
                 request_created_for_new_type, status, company_id, datetime.utcnow(), datetime.utcnow())
            )
            result = cursor.fetchone()
            return Task(**dict(result))

    @staticmethod
    def get_by_id(task_id: int) -> Optional['Task']:
        """Get task by ID"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM tasks WHERE id = %s", (task_id,))
            result = cursor.fetchone()
            return Task(**dict(result)) if result else None

    @staticmethod
    def get_all() -> List['Task']:
        """Get all tasks"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM tasks ORDER BY created_at DESC")
            results = cursor.fetchall()
            return [Task(**dict(row)) for row in results]

    def update(self) -> 'Task':
        """Update task"""
        if not self.id:
            raise ValueError("Task ID is required for update")
        with get_db_cursor() as cursor:
            cursor.execute(
                """UPDATE tasks SET task_activity = %s, type_id = %s, subject_apartment = %s, 
                   assigned_to_id = %s, schedule_date = %s, location_id = %s, priority = %s, 
                   maintenance_type_id = %s, description = %s, work_order_id = %s, 
                   request_created_for_new_type = %s, status = %s, company_id = %s, updated_at = %s 
                   WHERE id = %s RETURNING *""",
                (self.task_activity, self.type_id, self.subject_apartment, self.assigned_to_id,
                 self.schedule_date, self.location_id, self.priority, self.maintenance_type_id,
                 self.description, self.work_order_id, self.request_created_for_new_type, self.status,
                 self.company_id, datetime.utcnow(), self.id)
            )
            result = cursor.fetchone()
            return Task(**dict(result))

    def delete(self) -> bool:
        """Delete task"""
        if not self.id:
            raise ValueError("Task ID is required for delete")
        with get_db_cursor() as cursor:
            cursor.execute("DELETE FROM tasks WHERE id = %s", (self.id,))
            return cursor.rowcount > 0


class WorkOrderTask:
    def __init__(self, id: Optional[int] = None, work_order_id: Optional[int] = None,
                 task_id: Optional[int] = None,
                 created_at: Optional[datetime] = None):
        self.id = id
        self.work_order_id = work_order_id
        self.task_id = task_id
        self.created_at = created_at

    @staticmethod
    def create(work_order_id: int, task_id: int) -> 'WorkOrderTask':
        """Link task to work order"""
        with get_db_cursor() as cursor:
            cursor.execute(
                "INSERT INTO work_order_tasks (work_order_id, task_id, created_at) VALUES (%s, %s, %s) RETURNING *",
                (work_order_id, task_id, datetime.utcnow())
            )
            result = cursor.fetchone()
            return WorkOrderTask(**dict(result))

    @staticmethod
    def get_by_work_order(work_order_id: int) -> List['WorkOrderTask']:
        """Get all tasks for a work order"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM work_order_tasks WHERE work_order_id = %s", (work_order_id,))
            results = cursor.fetchall()
            return [WorkOrderTask(**dict(row)) for row in results]

    def delete(self) -> bool:
        """Unlink task from work order"""
        if not self.id:
            raise ValueError("WorkOrderTask ID is required for delete")
        with get_db_cursor() as cursor:
            cursor.execute("DELETE FROM work_order_tasks WHERE id = %s", (self.id,))
            return cursor.rowcount > 0

