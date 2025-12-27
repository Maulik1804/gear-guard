"""
Maintenance Schedule Model using psycopg2
"""

from datetime import datetime, date, time
from decimal import Decimal
from typing import Optional, List
from models.db import get_db_cursor


class MaintenanceSchedule:
    def __init__(self, id: Optional[int] = None, equipment_id: Optional[int] = None,
                 task_id: Optional[int] = None, work_order_id: Optional[int] = None,
                 scheduled_date: date = None, scheduled_time: Optional[time] = None,
                 duration_hours: Optional[Decimal] = None, assigned_to_id: Optional[int] = None,
                 status: str = 'scheduled', notes: Optional[str] = None,
                 company_id: Optional[int] = None,
                 created_at: Optional[datetime] = None, 
                 updated_at: Optional[datetime] = None):
        self.id = id
        self.equipment_id = equipment_id
        self.task_id = task_id
        self.work_order_id = work_order_id
        self.scheduled_date = scheduled_date
        self.scheduled_time = scheduled_time
        self.duration_hours = duration_hours
        self.assigned_to_id = assigned_to_id
        self.status = status
        self.notes = notes
        self.company_id = company_id
        self.created_at = created_at
        self.updated_at = updated_at

    @staticmethod
    def create(equipment_id: Optional[int] = None, task_id: Optional[int] = None,
               work_order_id: Optional[int] = None, scheduled_date: date = None,
               scheduled_time: Optional[time] = None, duration_hours: Optional[Decimal] = None,
               assigned_to_id: Optional[int] = None, status: str = 'scheduled',
               notes: Optional[str] = None, company_id: Optional[int] = None) -> 'MaintenanceSchedule':
        """Create a new maintenance schedule"""
        with get_db_cursor() as cursor:
            cursor.execute(
                """INSERT INTO maintenance_schedules (equipment_id, task_id, work_order_id, scheduled_date, 
                   scheduled_time, duration_hours, assigned_to_id, status, notes, company_id, created_at, updated_at) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING *""",
                (equipment_id, task_id, work_order_id, scheduled_date, scheduled_time,
                 duration_hours, assigned_to_id, status, notes, company_id, datetime.utcnow(), datetime.utcnow())
            )
            result = cursor.fetchone()
            return MaintenanceSchedule(**dict(result))

    @staticmethod
    def get_by_id(schedule_id: int) -> Optional['MaintenanceSchedule']:
        """Get maintenance schedule by ID"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM maintenance_schedules WHERE id = %s", (schedule_id,))
            result = cursor.fetchone()
            return MaintenanceSchedule(**dict(result)) if result else None

    @staticmethod
    def get_all() -> List['MaintenanceSchedule']:
        """Get all maintenance schedules"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM maintenance_schedules ORDER BY scheduled_date DESC")
            results = cursor.fetchall()
            return [MaintenanceSchedule(**dict(row)) for row in results]

    @staticmethod
    def get_by_date_range(start_date: date, end_date: date) -> List['MaintenanceSchedule']:
        """Get maintenance schedules by date range"""
        with get_db_cursor() as cursor:
            cursor.execute(
                "SELECT * FROM maintenance_schedules WHERE scheduled_date BETWEEN %s AND %s ORDER BY scheduled_date",
                (start_date, end_date)
            )
            results = cursor.fetchall()
            return [MaintenanceSchedule(**dict(row)) for row in results]

    def update(self) -> 'MaintenanceSchedule':
        """Update maintenance schedule"""
        if not self.id:
            raise ValueError("MaintenanceSchedule ID is required for update")
        with get_db_cursor() as cursor:
            cursor.execute(
                """UPDATE maintenance_schedules SET equipment_id = %s, task_id = %s, work_order_id = %s, 
                   scheduled_date = %s, scheduled_time = %s, duration_hours = %s, assigned_to_id = %s, 
                   status = %s, notes = %s, company_id = %s, updated_at = %s WHERE id = %s RETURNING *""",
                (self.equipment_id, self.task_id, self.work_order_id, self.scheduled_date,
                 self.scheduled_time, self.duration_hours, self.assigned_to_id, self.status,
                 self.notes, self.company_id, datetime.utcnow(), self.id)
            )
            result = cursor.fetchone()
            return MaintenanceSchedule(**dict(result))

    def delete(self) -> bool:
        """Delete maintenance schedule"""
        if not self.id:
            raise ValueError("MaintenanceSchedule ID is required for delete")
        with get_db_cursor() as cursor:
            cursor.execute("DELETE FROM maintenance_schedules WHERE id = %s", (self.id,))
            return cursor.rowcount > 0

