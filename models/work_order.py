"""
Work Order Model using psycopg2
"""

from datetime import datetime, date
from decimal import Decimal
from typing import Optional, List
from models.db import get_db_cursor


class WorkOrder:
    def __init__(self, id: Optional[int] = None, work_order_number: str = None,
                 cost: Optional[Decimal] = None, tag: Optional[str] = None,
                 alternative_information: Optional[str] = None,
                 cost_per_hour: Optional[Decimal] = None,
                 capacity_task_estimate: Optional[Decimal] = None,
                 goal_target: Optional[str] = None, work_center_id: Optional[int] = None,
                 equipment_id: Optional[int] = None, from_date: Optional[date] = None,
                 to_date: Optional[date] = None, status: str = 'draft',
                 company_id: Optional[int] = None,
                 created_at: Optional[datetime] = None, 
                 updated_at: Optional[datetime] = None):
        self.id = id
        self.work_order_number = work_order_number
        self.cost = cost
        self.tag = tag
        self.alternative_information = alternative_information
        self.cost_per_hour = cost_per_hour
        self.capacity_task_estimate = capacity_task_estimate
        self.goal_target = goal_target
        self.work_center_id = work_center_id
        self.equipment_id = equipment_id
        self.from_date = from_date
        self.to_date = to_date
        self.status = status
        self.company_id = company_id
        self.created_at = created_at
        self.updated_at = updated_at

    @staticmethod
    def create(work_order_number: str, cost: Optional[Decimal] = None,
               tag: Optional[str] = None, alternative_information: Optional[str] = None,
               cost_per_hour: Optional[Decimal] = None,
               capacity_task_estimate: Optional[Decimal] = None,
               goal_target: Optional[str] = None, work_center_id: Optional[int] = None,
               equipment_id: Optional[int] = None, from_date: Optional[date] = None,
               to_date: Optional[date] = None, status: str = 'draft',
               company_id: Optional[int] = None) -> 'WorkOrder':
        """Create a new work order"""
        with get_db_cursor() as cursor:
            cursor.execute(
                """INSERT INTO work_orders (work_order_number, cost, tag, alternative_information, 
                   cost_per_hour, capacity_task_estimate, goal_target, work_center_id, equipment_id, 
                   from_date, to_date, status, company_id, created_at, updated_at) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING *""",
                (work_order_number, cost, tag, alternative_information, cost_per_hour,
                 capacity_task_estimate, goal_target, work_center_id, equipment_id, from_date,
                 to_date, status, company_id, datetime.utcnow(), datetime.utcnow())
            )
            result = cursor.fetchone()
            return WorkOrder(**dict(result))

    @staticmethod
    def get_by_id(work_order_id: int) -> Optional['WorkOrder']:
        """Get work order by ID"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM work_orders WHERE id = %s", (work_order_id,))
            result = cursor.fetchone()
            return WorkOrder(**dict(result)) if result else None

    @staticmethod
    def get_all() -> List['WorkOrder']:
        """Get all work orders"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM work_orders ORDER BY created_at DESC")
            results = cursor.fetchall()
            return [WorkOrder(**dict(row)) for row in results]

    def update(self) -> 'WorkOrder':
        """Update work order"""
        if not self.id:
            raise ValueError("WorkOrder ID is required for update")
        with get_db_cursor() as cursor:
            cursor.execute(
                """UPDATE work_orders SET work_order_number = %s, cost = %s, tag = %s, 
                   alternative_information = %s, cost_per_hour = %s, capacity_task_estimate = %s, 
                   goal_target = %s, work_center_id = %s, equipment_id = %s, from_date = %s, 
                   to_date = %s, status = %s, company_id = %s, updated_at = %s WHERE id = %s RETURNING *""",
                (self.work_order_number, self.cost, self.tag, self.alternative_information,
                 self.cost_per_hour, self.capacity_task_estimate, self.goal_target, self.work_center_id,
                 self.equipment_id, self.from_date, self.to_date, self.status, self.company_id,
                 datetime.utcnow(), self.id)
            )
            result = cursor.fetchone()
            return WorkOrder(**dict(result))

    def delete(self) -> bool:
        """Delete work order"""
        if not self.id:
            raise ValueError("WorkOrder ID is required for delete")
        with get_db_cursor() as cursor:
            cursor.execute("DELETE FROM work_orders WHERE id = %s", (self.id,))
            return cursor.rowcount > 0

