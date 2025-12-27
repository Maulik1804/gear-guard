"""
User Model using psycopg2
"""

from datetime import datetime
from typing import Optional, List
from models.db import get_db_cursor
import bcrypt


class User:
    def __init__(self, id: Optional[int] = None, name: str = None, 
                 email: str = None, password_hash: str = None,
                 company_id: Optional[int] = None, role: str = 'user',
                 created_at: Optional[datetime] = None, 
                 updated_at: Optional[datetime] = None):
        self.id = id
        self.name = name
        self.email = email
        self.password_hash = password_hash
        self.company_id = company_id
        self.role = role
        self.created_at = created_at
        self.updated_at = updated_at

    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password using bcrypt"""
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    @staticmethod
    def verify_password(password: str, password_hash: str) -> bool:
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))

    @staticmethod
    def create(name: str, email: str, password: str, 
               company_id: Optional[int] = None, role: str = 'user') -> 'User':
        """Create a new user"""
        password_hash = User.hash_password(password)
        with get_db_cursor() as cursor:
            cursor.execute(
                """INSERT INTO users (name, email, password_hash, company_id, role, created_at, updated_at) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING *""",
                (name, email, password_hash, company_id, role, datetime.utcnow(), datetime.utcnow())
            )
            result = cursor.fetchone()
            return User(**dict(result))

    @staticmethod
    def get_by_id(user_id: int) -> Optional['User']:
        """Get user by ID"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
            result = cursor.fetchone()
            return User(**dict(result)) if result else None

    @staticmethod
    def get_by_email(email: str) -> Optional['User']:
        """Get user by email"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            result = cursor.fetchone()
            return User(**dict(result)) if result else None

    @staticmethod
    def get_all() -> List['User']:
        """Get all users"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM users ORDER BY created_at DESC")
            results = cursor.fetchall()
            return [User(**dict(row)) for row in results]

    def update(self) -> 'User':
        """Update user"""
        if not self.id:
            raise ValueError("User ID is required for update")
        with get_db_cursor() as cursor:
            cursor.execute(
                """UPDATE users SET name = %s, email = %s, company_id = %s, role = %s, updated_at = %s 
                   WHERE id = %s RETURNING *""",
                (self.name, self.email, self.company_id, self.role, datetime.utcnow(), self.id)
            )
            result = cursor.fetchone()
            return User(**dict(result))

    def delete(self) -> bool:
        """Delete user"""
        if not self.id:
            raise ValueError("User ID is required for delete")
        with get_db_cursor() as cursor:
            cursor.execute("DELETE FROM users WHERE id = %s", (self.id,))
            return cursor.rowcount > 0

