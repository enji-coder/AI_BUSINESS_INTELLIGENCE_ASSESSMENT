from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, BusinessProfile
from ..schemas import ProfileUpdate, ProfileOut
from ..auth import get_current_user

router = APIRouter(prefix="/profile", tags=["Business Profile"])

@router.get("", response_model=ProfileOut)
def get_profile(db: Session = Depends(get_db)):
    profile = db.query(BusinessProfile).first()
    if not profile:
        profile = BusinessProfile(
            institute_name="Apex Institute of Advanced Technology",
            industry="Education: Institute & Student Performance Intelligence",
            team_size="65 Faculty & Operations Staff",
            student_capacity=2500,
            business_goals="Drive 90%+ course completion rate, reduce dropouts below 10%, recover ₹7.5M in pending fees."
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("", response_model=ProfileOut)
def update_profile(
    profile_in: ProfileUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = db.query(BusinessProfile).first()
    if not profile:
        profile = BusinessProfile()
        db.add(profile)
    
    profile.institute_name = profile_in.institute_name
    profile.industry = profile_in.industry
    profile.team_size = profile_in.team_size
    profile.student_capacity = profile_in.student_capacity
    profile.business_goals = profile_in.business_goals
    
    db.commit()
    db.refresh(profile)
    return profile
