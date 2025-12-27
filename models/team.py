"""
Team Model using psycopg2
"""

from datetime import datetime
from typing import Optional, List
from models.db import get_db_cursor


class Team:
    def __init__(self, id: Optional[int] = None, team_name: str = None,
                 team_leader_id: Optional[int] = None, company_id: Optional[int] = None,
                 created_at: Optional[datetime] = None, 
                 updated_at: Optional[datetime] = None):
        self.id = id
        self.team_name = team_name
        self.team_leader_id = team_leader_id
        self.company_id = company_id
        self.created_at = created_at
        self.updated_at = updated_at

    @staticmethod
    def create(team_name: str, team_leader_id: Optional[int] = None,
               company_id: Optional[int] = None) -> 'Team':
        """Create a new team"""
        with get_db_cursor() as cursor:
            cursor.execute(
                """INSERT INTO teams (team_name, team_leader_id, company_id, created_at, updated_at) 
                   VALUES (%s, %s, %s, %s, %s) RETURNING *""",
                (team_name, team_leader_id, company_id, datetime.utcnow(), datetime.utcnow())
            )
            result = cursor.fetchone()
            return Team(**dict(result))

    @staticmethod
    def get_by_id(team_id: int) -> Optional['Team']:
        """Get team by ID"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM teams WHERE id = %s", (team_id,))
            result = cursor.fetchone()
            return Team(**dict(result)) if result else None

    @staticmethod
    def get_all() -> List['Team']:
        """Get all teams"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM teams ORDER BY created_at DESC")
            results = cursor.fetchall()
            return [Team(**dict(row)) for row in results]

    def update(self) -> 'Team':
        """Update team"""
        if not self.id:
            raise ValueError("Team ID is required for update")
        with get_db_cursor() as cursor:
            cursor.execute(
                """UPDATE teams SET team_name = %s, team_leader_id = %s, company_id = %s, updated_at = %s 
                   WHERE id = %s RETURNING *""",
                (self.team_name, self.team_leader_id, self.company_id, datetime.utcnow(), self.id)
            )
            result = cursor.fetchone()
            return Team(**dict(result))

    def delete(self) -> bool:
        """Delete team"""
        if not self.id:
            raise ValueError("Team ID is required for delete")
        with get_db_cursor() as cursor:
            cursor.execute("DELETE FROM teams WHERE id = %s", (self.id,))
            return cursor.rowcount > 0


class TeamMember:
    def __init__(self, id: Optional[int] = None, team_id: Optional[int] = None,
                 employee_id: Optional[int] = None,
                 created_at: Optional[datetime] = None):
        self.id = id
        self.team_id = team_id
        self.employee_id = employee_id
        self.created_at = created_at

    @staticmethod
    def create(team_id: int, employee_id: int) -> 'TeamMember':
        """Add employee to team"""
        with get_db_cursor() as cursor:
            cursor.execute(
                "INSERT INTO team_members (team_id, employee_id, created_at) VALUES (%s, %s, %s) RETURNING *",
                (team_id, employee_id, datetime.utcnow())
            )
            result = cursor.fetchone()
            return TeamMember(**dict(result))

    @staticmethod
    def get_by_id(member_id: int) -> Optional['TeamMember']:
        """Get team member by ID"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM team_members WHERE id = %s", (member_id,))
            result = cursor.fetchone()
            return TeamMember(**dict(result)) if result else None

    @staticmethod
    def get_by_team(team_id: int) -> List['TeamMember']:
        """Get all members of a team"""
        with get_db_cursor() as cursor:
            cursor.execute("SELECT * FROM team_members WHERE team_id = %s", (team_id,))
            results = cursor.fetchall()
            return [TeamMember(**dict(row)) for row in results]

    def delete(self) -> bool:
        """Remove employee from team"""
        if not self.id:
            raise ValueError("TeamMember ID is required for delete")
        with get_db_cursor() as cursor:
            cursor.execute("DELETE FROM team_members WHERE id = %s", (self.id,))
            return cursor.rowcount > 0

