"""
Equipment Models using psycopg2
"""

from datetime import datetime, date
from typing import Optional, List
from models.db import get_db_cursor


class EquipmentCategory:
    def __init__(self, id: Optional[int] = None, name: str = None,
                 responsible_id: Optional[int] = None, company_id: Optional[int] = None,
                 created_at: Optional[datetime] = None, 
                 updated_at: Optional[datetime] = None):
        self.id = id
        self.name = name
        self.responsible_id = responsible_id
        self.company_id = company_id
        self.created_at = created_at
        self.updated_at = updated_at

    @staticmethod
    def create(name: str, responsible_id: Optional[int] = None,
               company_id: Optional[int] = None) -> 'EquipmentCategory':
        """Create a new equipment category"""
        with get_db_cursor() as cursor:
            cursor.execute(
                """INSERT INTO equipment_categories (name, responsible_id, company_id, created_at, updated_at) 
                   VALUES (%s, %s, %s, %s, %s) RETURNING *""",
                (name, responsible_id, company_id, datetime.utcnow(), datetime.utcnow())
            )
            result = cursor.fetchone()
            return EquipmentCategory(**dict(result))

    @staticmethod
    def get_by_id(category_id: int) -> Optional['EquipmentCategory']:
        """Get equipment category by ID"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM equipment_categories WHERE id = %s", (category_id,))
            result = cursor.fetchone()
            return EquipmentCategory(**dict(result)) if result else None

    @staticmethod
    def get_all() -> List['EquipmentCategory']:
        """Get all equipment categories"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM equipment_categories ORDER BY created_at DESC")
            results = cursor.fetchall()
            return [EquipmentCategory(**dict(row)) for row in results]


class MaintenanceType:
    def __init__(self, id: Optional[int] = None, name: str = None,
                 description: Optional[str] = None, company_id: Optional[int] = None,
                 created_at: Optional[datetime] = None, 
                 updated_at: Optional[datetime] = None):
        self.id = id
        self.name = name
        self.description = description
        self.company_id = company_id
        self.created_at = created_at
        self.updated_at = updated_at

    @staticmethod
    def create(name: str, description: Optional[str] = None,
               company_id: Optional[int] = None) -> 'MaintenanceType':
        """Create a new maintenance type"""
        with get_db_cursor() as cursor:
            cursor.execute(
                """INSERT INTO maintenance_types (name, description, company_id, created_at, updated_at) 
                   VALUES (%s, %s, %s, %s, %s) RETURNING *""",
                (name, description, company_id, datetime.utcnow(), datetime.utcnow())
            )
            result = cursor.fetchone()
            return MaintenanceType(**dict(result))

    @staticmethod
    def get_by_id(maintenance_type_id: int) -> Optional['MaintenanceType']:
        """Get maintenance type by ID"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM maintenance_types WHERE id = %s", (maintenance_type_id,))
            result = cursor.fetchone()
            return MaintenanceType(**dict(result)) if result else None

    @staticmethod
    def get_all() -> List['MaintenanceType']:
        """Get all maintenance types"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM maintenance_types ORDER BY created_at DESC")
            results = cursor.fetchall()
            return [MaintenanceType(**dict(row)) for row in results]


class Equipment:
    def __init__(self, id: Optional[int] = None, equipment_name: str = None,
                 type_model: Optional[str] = None, equipment_category_id: Optional[int] = None,
                 company_id: Optional[int] = None, used_by_id: Optional[int] = None,
                 used_in_location_id: Optional[int] = None, maintenance_type_id: Optional[int] = None,
                 assigned_date: Optional[date] = None, stop_date: Optional[date] = None,
                 description: Optional[str] = None, status: str = 'active',
                 created_at: Optional[datetime] = None, 
                 updated_at: Optional[datetime] = None):
        self.id = id
        self.equipment_name = equipment_name
        self.type_model = type_model
        self.equipment_category_id = equipment_category_id
        self.company_id = company_id
        self.used_by_id = used_by_id
        self.used_in_location_id = used_in_location_id
        self.maintenance_type_id = maintenance_type_id
        self.assigned_date = assigned_date
        self.stop_date = stop_date
        self.description = description
        self.status = status
        self.created_at = created_at
        self.updated_at = updated_at

    @staticmethod
    def create(equipment_name: str, type_model: Optional[str] = None,
               equipment_category_id: Optional[int] = None, company_id: Optional[int] = None,
               used_by_id: Optional[int] = None, used_in_location_id: Optional[int] = None,
               maintenance_type_id: Optional[int] = None, assigned_date: Optional[date] = None,
               stop_date: Optional[date] = None, description: Optional[str] = None,
               status: str = 'active') -> 'Equipment':
        """Create a new equipment"""
        with get_db_cursor() as cursor:
            cursor.execute(
                """INSERT INTO equipment (equipment_name, type_model, equipment_category_id, company_id, 
                   used_by_id, used_in_location_id, maintenance_type_id, assigned_date, stop_date, 
                   description, status, created_at, updated_at) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING *""",
                (equipment_name, type_model, equipment_category_id, company_id, used_by_id,
                 used_in_location_id, maintenance_type_id, assigned_date, stop_date, description,
                 status, datetime.utcnow(), datetime.utcnow())
            )
            result = cursor.fetchone()
            return Equipment(**dict(result))

    @staticmethod
    def get_by_id(equipment_id: int) -> Optional['Equipment']:
        """Get equipment by ID"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM equipment WHERE id = %s", (equipment_id,))
            result = cursor.fetchone()
            return Equipment(**dict(result)) if result else None

    @staticmethod
    def get_all() -> List['Equipment']:
        """Get all equipment"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM equipment ORDER BY created_at DESC")
            results = cursor.fetchall()
            return [Equipment(**dict(row)) for row in results]

    def update(self) -> 'Equipment':
        """Update equipment"""
        if not self.id:
            raise ValueError("Equipment ID is required for update")
        with get_db_cursor() as cursor:
            cursor.execute(
                """UPDATE equipment SET equipment_name = %s, type_model = %s, equipment_category_id = %s, 
                   company_id = %s, used_by_id = %s, used_in_location_id = %s, maintenance_type_id = %s, 
                   assigned_date = %s, stop_date = %s, description = %s, status = %s, updated_at = %s 
                   WHERE id = %s RETURNING *""",
                (self.equipment_name, self.type_model, self.equipment_category_id, self.company_id,
                 self.used_by_id, self.used_in_location_id, self.maintenance_type_id, self.assigned_date,
                 self.stop_date, self.description, self.status, datetime.utcnow(), self.id)
            )
            result = cursor.fetchone()
            return Equipment(**dict(result))

    def delete(self) -> bool:
        """Delete equipment"""
        if not self.id:
            raise ValueError("Equipment ID is required for delete")
        with get_db_cursor() as cursor:
            cursor.execute("DELETE FROM equipment WHERE id = %s", (self.id,))
            return cursor.rowcount > 0

