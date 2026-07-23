from typing import List
from app.models.schemas import HospitalItem, HospitalSearchResponse

class HospitalService:
    """
    Service for querying nearby emergency rooms, urgent care centers, and specialty clinics.
    """

    async def search_hospitals(self, query: str = "General Emergency") -> HospitalSearchResponse:
        # Mock database / Overpass OSM search integration
        sample_hospitals = [
            HospitalItem(
                name="City General Hospital & Emergency Center",
                address="124 Medical Center Drive, Suite 100",
                distanceKm=1.2,
                phone="+1 (555) 019-2831",
                emergencyRoom=True
            ),
            HospitalItem(
                name="St. Jude Urgent Care & Multi-Specialty Clinic",
                address="588 Health Plaza Boulevard",
                distanceKm=2.8,
                phone="+1 (555) 014-9920",
                emergencyRoom=True
            ),
            HospitalItem(
                name="Community Health Outpatient Pavilion",
                address="901 Wellness Way",
                distanceKm=4.5,
                phone="+1 (555) 018-4411",
                emergencyRoom=False
            )
        ]

        return HospitalSearchResponse(
            query=query,
            hospitals=sample_hospitals
        )

hospital_service = HospitalService()
