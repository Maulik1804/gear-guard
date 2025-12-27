"""
Company API Routes
"""

from fastapi import APIRouter, HTTPException, status
from typing import List
from models.company import Company
from schemas.company import CompanyCreate, CompanyUpdate, CompanyResponse

router = APIRouter()


@router.post("/", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
async def create_company(company: CompanyCreate):
    """Create a new company"""
    try:
        new_company = Company.create(company.name)
        return CompanyResponse(
            id=new_company.id,
            name=new_company.name,
            created_at=new_company.created_at,
            updated_at=new_company.updated_at
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating company: {str(e)}"
        )


@router.get("/", response_model=List[CompanyResponse])
async def get_companies():
    """Get all companies"""
    try:
        companies = Company.get_all()
        return [
            CompanyResponse(
                id=c.id,
                name=c.name,
                created_at=c.created_at,
                updated_at=c.updated_at
            )
            for c in companies
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching companies: {str(e)}"
        )


@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company(company_id: int):
    """Get company by ID"""
    company = Company.get_by_id(company_id)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Company with id {company_id} not found"
        )
    return CompanyResponse(
        id=company.id,
        name=company.name,
        created_at=company.created_at,
        updated_at=company.updated_at
    )


@router.put("/{company_id}", response_model=CompanyResponse)
async def update_company(company_id: int, company_update: CompanyUpdate):
    """Update company"""
    company = Company.get_by_id(company_id)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Company with id {company_id} not found"
        )
    
    if company_update.name is not None:
        company.name = company_update.name
    
    updated_company = company.update()
    return CompanyResponse(
        id=updated_company.id,
        name=updated_company.name,
        created_at=updated_company.created_at,
        updated_at=updated_company.updated_at
    )


@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_company(company_id: int):
    """Delete company"""
    company = Company.get_by_id(company_id)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Company with id {company_id} not found"
        )
    
    success = company.delete()
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting company"
        )
    return None

