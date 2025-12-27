"""
Work Center Model using psycopg2
"""

from datetime import datetime
from typing import Optional, List
from models.db import get_db_cursor


class WorkCenter:
    def __init__(self, id: Optional[int] = None, name: str = None,
                 work_center_group: Optional[str] = None, company_id: Optional[int] = None,
                 created_at: Optional[datetime] = None, 
                 updated_at: Optional[datetime] = None):
        self.id = id
        self.name = name
        self.work_center_group = work_center_group
        self.company_id = company_id
        self.created_at = created_at
        self.updated_at = updated_at

    @staticmethod
    def create(name: str, work_center_group: Optional[str] = None,
               company_id: Optional[int] = None) -> 'WorkCenter':
        """Create a new work center"""
        with get_db_cursor() as cursor:
            cursor.execute(
                """INSERT INTO work_centers (name, work_center_group, company_id, created_at, updated_at) 
                   VALUES (%s, %s, %s, %s, %s) RETURNING *""",
                (name, work_center_group, company_id, datetime.utcnow(), datetime.utcnow())
            )
            result = cursor.fetchone()
            return WorkCenter(**dict(result))

    @staticmethod
    def get_by_id(work_center_id: int) -> Optional['WorkCenter']:
        """Get work center by ID"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM work_centers WHERE id = %s", (work_center_id,))
            result = cursor.fetchone()
            return WorkCenter(**dict(result)) if result else None

    @staticmethod
    def get_all() -> List['WorkCenter']:
        """Get all work centers"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM work_centers ORDER BY created_at DESC")
            results = cursor.fetchall()
            return [WorkCenter(**dict(row)) for row in results]

    def update(self) -> 'WorkCenter':
        """Update work center"""
        if not self.id:
            raise ValueError("WorkCenter ID is required for update")
        with get_db_cursor() as cursor:
            cursor.execute(
                """UPDATE work_centers SET name = %s, work_center_group = %s, company_id = %s, updated_at = %s 
                   WHERE id = %s RETURNING *""",
                (self.name, self.work_center_group, self.company_id, datetime.utcnow(), self.id)
            )
            result = cursor.fetchone()
            return WorkCenter(**dict(result))

    def delete(self) -> bool:
        """Delete work center"""
        if not self.id:
            raise ValueError("WorkCenter ID is required for delete")
        with get_db_cursor() as cursor:
            cursor.execute("DELETE FROM work_centers WHERE id = %s", (self.id,))
            return cursor.rowcount > 0

