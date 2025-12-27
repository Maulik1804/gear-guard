"""
Company Model using psycopg2
"""

from datetime import datetime
from typing import Optional, List, Dict
from models.db import get_db_cursor


class Company:
    def __init__(self, id: Optional[int] = None, name: str = None, 
                 created_at: Optional[datetime] = None, 
                 updated_at: Optional[datetime] = None):
        self.id = id
        self.name = name
        self.created_at = created_at
        self.updated_at = updated_at

    @staticmethod
    def create(name: str) -> 'Company':
        """Create a new company"""
        with get_db_cursor() as cursor:
            cursor.execute(
                "INSERT INTO companies (name, created_at, updated_at) VALUES (%s, %s, %s) RETURNING *",
                (name, datetime.utcnow(), datetime.utcnow())
            )
            result = cursor.fetchone()
            return Company(**dict(result))

    @staticmethod
    def get_by_id(company_id: int) -> Optional['Company']:
        """Get company by ID"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM companies WHERE id = %s", (company_id,))
            result = cursor.fetchone()
            return Company(**dict(result)) if result else None

    @staticmethod
    def get_all() -> List['Company']:
        """Get all companies"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM companies ORDER BY created_at DESC")
            results = cursor.fetchall()
            return [Company(**dict(row)) for row in results]

    def update(self) -> 'Company':
        """Update company"""
        if not self.id:
            raise ValueError("Company ID is required for update")
        with get_db_cursor() as cursor:
            cursor.execute(
                "UPDATE companies SET name = %s, updated_at = %s WHERE id = %s RETURNING *",
                (self.name, datetime.utcnow(), self.id)
            )
            result = cursor.fetchone()
            return Company(**dict(result))

    def delete(self) -> bool:
        """Delete company"""
        if not self.id:
            raise ValueError("Company ID is required for delete")
        with get_db_cursor() as cursor:
            cursor.execute("DELETE FROM companies WHERE id = %s", (self.id,))
            return cursor.rowcount > 0

