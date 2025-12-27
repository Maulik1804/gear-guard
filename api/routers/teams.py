"""
Team API Routes
"""

from fastapi import APIRouter, HTTPException, status
from typing import List
from models.team import Team, TeamMember
from schemas.team import (
    TeamCreate, TeamUpdate, TeamResponse,
    TeamMemberCreate, TeamMemberResponse
)

router = APIRouter()


# Team endpoints
@router.post("/", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
async def create_team(team: TeamCreate):
    """Create a new team"""
    try:
        new_team = Team.create(
            team_name=team.team_name,
            team_leader_id=team.team_leader_id,
            company_id=team.company_id
        )
        return TeamResponse(
            id=new_team.id,
            team_name=new_team.team_name,
            team_leader_id=new_team.team_leader_id,
            company_id=new_team.company_id,
            created_at=new_team.created_at,
            updated_at=new_team.updated_at
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating team: {str(e)}"
        )


@router.get("/", response_model=List[TeamResponse])
async def get_teams():
    """Get all teams"""
    try:
        teams = Team.get_all()
        return [
            TeamResponse(
                id=t.id,
                team_name=t.team_name,
                team_leader_id=t.team_leader_id,
                company_id=t.company_id,
                created_at=t.created_at,
                updated_at=t.updated_at
            )
            for t in teams
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching teams: {str(e)}"
        )


@router.get("/{team_id}", response_model=TeamResponse)
async def get_team(team_id: int):
    """Get team by ID"""
    team = Team.get_by_id(team_id)
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Team with id {team_id} not found"
        )
    return TeamResponse(
        id=team.id,
        team_name=team.team_name,
        team_leader_id=team.team_leader_id,
        company_id=team.company_id,
        created_at=team.created_at,
        updated_at=team.updated_at
    )


@router.put("/{team_id}", response_model=TeamResponse)
async def update_team(team_id: int, team_update: TeamUpdate):
    """Update team"""
    team = Team.get_by_id(team_id)
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Team with id {team_id} not found"
        )
    
    if team_update.team_name is not None:
        team.team_name = team_update.team_name
    if team_update.team_leader_id is not None:
        team.team_leader_id = team_update.team_leader_id
    if team_update.company_id is not None:
        team.company_id = team_update.company_id
    
    updated_team = team.update()
    return TeamResponse(
        id=updated_team.id,
        team_name=updated_team.team_name,
        team_leader_id=updated_team.team_leader_id,
        company_id=updated_team.company_id,
        created_at=updated_team.created_at,
        updated_at=updated_team.updated_at
    )


@router.delete("/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_team(team_id: int):
    """Delete team"""
    team = Team.get_by_id(team_id)
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Team with id {team_id} not found"
        )
    
    success = team.delete()
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting team"
        )
    return None


# Team Member endpoints
@router.post("/{team_id}/members", response_model=TeamMemberResponse, status_code=status.HTTP_201_CREATED)
async def add_team_member(team_id: int, member: TeamMemberCreate):
    """Add employee to team"""
    try:
        new_member = TeamMember.create(team_id=team_id, employee_id=member.employee_id)
        return TeamMemberResponse(
            id=new_member.id,
            team_id=new_member.team_id,
            employee_id=new_member.employee_id,
            created_at=new_member.created_at
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error adding team member: {str(e)}"
        )


@router.get("/{team_id}/members", response_model=List[TeamMemberResponse])
async def get_team_members(team_id: int):
    """Get all members of a team"""
    try:
        members = TeamMember.get_by_team(team_id)
        return [
            TeamMemberResponse(
                id=m.id,
                team_id=m.team_id,
                employee_id=m.employee_id,
                created_at=m.created_at
            )
            for m in members
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching team members: {str(e)}"
        )


@router.delete("/members/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_team_member(member_id: int):
    """Remove employee from team"""
    member = TeamMember.get_by_id(member_id)
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Team member with id {member_id} not found"
        )
    
    success = member.delete()
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error removing team member"
        )
    return None

