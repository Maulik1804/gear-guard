"""
Location Model using psycopg2
"""

from datetime import datetime
from typing import Optional, List
from models.db import get_db_cursor


class Location:
    def __init__(self, id: Optional[int] = None, name: str = None,
                 address: Optional[str] = None, company_id: Optional[int] = None,
                 created_at: Optional[datetime] = None, 
                 updated_at: Optional[datetime] = None):
        self.id = id
        self.name = name
        self.address = address
        self.company_id = company_id
        self.created_at = created_at
        self.updated_at = updated_at

    @staticmethod
    def create(name: str, address: Optional[str] = None,
               company_id: Optional[int] = None) -> 'Location':
        """Create a new location"""
        with get_db_cursor() as cursor:
            cursor.execute(
                """INSERT INTO locations (name, address, company_id, created_at, updated_at) 
                   VALUES (%s, %s, %s, %s, %s) RETURNING *""",
                (name, address, company_id, datetime.utcnow(), datetime.utcnow())
            )
            result = cursor.fetchone()
            return Location(**dict(result))

    @staticmethod
    def get_by_id(location_id: int) -> Optional['Location']:
        """Get location by ID"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM locations WHERE id = %s", (location_id,))
            result = cursor.fetchone()
            return Location(**dict(result)) if result else None

    @staticmethod
    def get_all() -> List['Location']:
        """Get all locations"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM locations ORDER BY created_at DESC")
            results = cursor.fetchall()
            return [Location(**dict(row)) for row in results]

    def update(self) -> 'Location':
        """Update location"""
        if not self.id:
            raise ValueError("Location ID is required for update")
        with get_db_cursor() as cursor:
            cursor.execute(
                """UPDATE locations SET name = %s, address = %s, company_id = %s, updated_at = %s 
                   WHERE id = %s RETURNING *""",
                (self.name, self.address, self.company_id, datetime.utcnow(), self.id)
            )
            result = cursor.fetchone()
            return Location(**dict(result))

    def delete(self) -> bool:
        """Delete location"""
        if not self.id:
            raise ValueError("Location ID is required for delete")
        with get_db_cursor() as cursor:
            cursor.execute("DELETE FROM locations WHERE id = %s", (self.id,))
            return cursor.rowcount > 0

