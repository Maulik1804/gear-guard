"""
User API Routes
"""

from fastapi import APIRouter, HTTPException, status
from typing import List
from models.user import User
from schemas.user import UserCreate, UserUpdate, UserResponse

router = APIRouter()


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate):
    """Create a new user"""
    try:
        # Check if email already exists
        existing_user = User.get_by_email(user.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        new_user = User.create(
            name=user.name,
            email=user.email,
            password=user.password,
            company_id=user.company_id,
            role=user.role
        )
        return UserResponse(
            id=new_user.id,
            name=new_user.name,
            email=new_user.email,
            company_id=new_user.company_id,
            role=new_user.role,
            created_at=new_user.created_at,
            updated_at=new_user.updated_at
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating user: {str(e)}"
        )


@router.get("/", response_model=List[UserResponse])
async def get_users():
    """Get all users"""
    try:
        users = User.get_all()
        return [
            UserResponse(
                id=u.id,
                name=u.name,
                email=u.email,
                company_id=u.company_id,
                role=u.role,
                created_at=u.created_at,
                updated_at=u.updated_at
            )
            for u in users
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching users: {str(e)}"
        )


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    """Get user by ID"""
    user = User.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found"
        )
    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        company_id=user.company_id,
        role=user.role,
        created_at=user.created_at,
        updated_at=user.updated_at
    )


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(user_id: int, user_update: UserUpdate):
    """Update user"""
    user = User.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found"
        )
    
    if user_update.name is not None:
        user.name = user_update.name
    if user_update.email is not None:
        # Check if new email is already taken
        existing_user = User.get_by_email(user_update.email)
        if existing_user and existing_user.id != user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        user.email = user_update.email
    if user_update.company_id is not None:
        user.company_id = user_update.company_id
    if user_update.role is not None:
        user.role = user_update.role
    if user_update.password is not None:
        user.password_hash = User.hash_password(user_update.password)
    
    updated_user = user.update()
    return UserResponse(
        id=updated_user.id,
        name=updated_user.name,
        email=updated_user.email,
        company_id=updated_user.company_id,
        role=updated_user.role,
        created_at=updated_user.created_at,
        updated_at=updated_user.updated_at
    )


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int):
    """Delete user"""
    user = User.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found"
        )
    
    success = user.delete()
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting user"
        )
    return None

