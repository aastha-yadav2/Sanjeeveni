from fastapi import APIRouter, HTTPException, status
from app.models.schemas import ReportRequest, ReportResponse
from app.services.report_service import report_service

router = APIRouter(prefix="/api", tags=["Report Generation"])

@router.post(
    "/report",
    response_model=ReportResponse,
    summary="Generate medical brief triage report",
    description="Compiles session history and extracted health summary into a formal medical brief."
)
async def generate_report(request: ReportRequest):
    try:
        report = await report_service.create_report(request)
        return report
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate medical report: {str(e)}"
        )
