from fastapi import APIRouter, Query
from app.models.schemas import HospitalSearchResponse
from app.services.hospital_service import hospital_service

router = APIRouter(prefix="/api", tags=["Hospital Search"])

@router.get(
    "/hospitals",
    response_model=HospitalSearchResponse,
    summary="Search nearby emergency rooms & healthcare facilities",
    description="Finds nearby healthcare facilities based on symptom query or emergency status."
)
async def search_hospitals(query: str = Query("General Emergency", description="Symptom or department query")):
    return await hospital_service.search_hospitals(query)
