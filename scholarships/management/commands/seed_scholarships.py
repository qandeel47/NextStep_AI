from datetime import date

from django.core.management.base import BaseCommand

from scholarships.models import Scholarship

COLLECTED = date(2026, 8, 29)
BY = 'Alisha Javed'

SCHOLARSHIPS = [
    {
        'name': 'HEC Need-Based Scholarship Program (NBSP)',
        'provider': 'Higher Education Commission (HEC)',
        'website': 'https://www.hec.gov.pk',
        'education_level': 'Undergraduate',
        'province': 'All Pakistan',
        'field_of_study': 'Any (not field restricted)',
        'eligibility': (
            'Pakistani national, admitted on merit in a 4–5 year BS program at an '
            'HEC-recognized public university; family income below ~Rs 45,000/month.'
        ),
        'coverage': 'Full tuition fee + Rs 6,000/month stipend.',
        'required_documents': 'CNIC/B-form, income certificate, admission proof, transcripts, university financial-aid form.',
        'application_deadline': 'As announced by HEC / host university each intake',
        'application_process': (
            'Apply through the university Financial Aid Office. Form also available at '
            'https://scholarship.hec.gov.pk'
        ),
        'contact': 'scholarship.hec.gov.pk',
        'source_url': 'https://www.hec.gov.pk',
        'min_marks': None,
    },
    {
        'name': 'Ehsaas Undergraduate Scholarship Program',
        'provider': 'Government of Pakistan / HEC',
        'website': 'https://www.hec.gov.pk',
        'education_level': 'Undergraduate',
        'province': 'All Pakistan',
        'field_of_study': 'Any (not field restricted)',
        'eligibility': (
            'Merit-based admission at an HEC-recognized public university; household income '
            '< Rs 45,000/month; 50% seats for women.'
        ),
        'coverage': 'Full tuition fee + monthly living stipend.',
        'required_documents': 'CNIC/B-form, income proof, university admission letter, academic records.',
        'application_deadline': 'As announced on the HEC Ehsaas portal',
        'application_process': 'Apply online via the HEC Ehsaas undergraduate scholarship portal.',
        'contact': 'HEC Ehsaas portal',
        'source_url': 'https://www.hec.gov.pk',
        'min_marks': None,
    },
    {
        'name': 'Punjab Educational Endowment Fund (PEEF)',
        'provider': 'Government of Punjab (PEEF)',
        'website': 'https://www.peef.org.pk',
        'education_level': 'Intermediate',
        'province': 'Punjab',
        'field_of_study': 'Any',
        'eligibility': (
            'Punjab domicile; minimum 60% marks or 2.5 CGPA; family income below the PEEF limit.'
        ),
        'coverage': 'Tuition fee, monthly stipend, and bookshelf allowance in some cases.',
        'required_documents': 'Punjab domicile, marksheet, income certificate, CNIC/B-form.',
        'application_deadline': 'Mostly outreach via BISE/FBISE merit lists (proactive)',
        'application_process': (
            'Mostly proactive: PEEF contacts eligible students via BISE/FBISE merit lists. '
            'Details at https://www.peef.org.pk'
        ),
        'contact': 'https://www.peef.org.pk',
        'source_url': 'https://www.peef.org.pk',
        'min_marks': 60,
    },
    {
        'name': 'Sindh Educational Endowment Fund (SEEF)',
        'provider': 'College Education Department, Government of Sindh',
        'website': 'https://seef.sindh.gov.pk',
        'education_level': 'Undergraduate',
        'province': 'Sindh',
        'field_of_study': 'IT, Engineering, Medicine, Business Administration',
        'eligibility': 'Low-income students of Sindh enrolled in SEEF-panel public/private universities.',
        'coverage': 'Tuition fee coverage, renewable yearly.',
        'required_documents': 'Sindh domicile, income proof, admission letter, academic records.',
        'application_deadline': 'As announced on the SEEF portal',
        'application_process': 'Online application at https://seef.sindh.gov.pk',
        'contact': 'seef.sindh.gov.pk',
        'source_url': 'https://seef.sindh.gov.pk',
        'min_marks': None,
    },
    {
        'name': 'Balochistan Educational Endowment Fund (BEEF)',
        'provider': 'Government of Balochistan',
        'website': 'https://beef.org.pk',
        'education_level': 'Undergraduate',
        'province': 'Balochistan',
        'field_of_study': 'Any (plus specialized tracks for ADE/teaching and LLM)',
        'eligibility': 'Balochistan domicile; minimum 60% marks or 2.5 CGPA; under 23 years of age.',
        'coverage': 'Tuition fee + stipend (varies by program).',
        'required_documents': 'Balochistan domicile, marksheet, CNIC/B-form, age proof, income documents if required.',
        'application_deadline': 'As announced at beef.org.pk',
        'application_process': 'Apply via https://beef.org.pk',
        'contact': 'beef.org.pk',
        'source_url': 'https://beef.org.pk',
        'min_marks': 60,
    },
    {
        'name': "KPK Educational Endowment Fund (CMEEF)",
        'provider': 'Higher Education Department, Government of Khyber Pakhtunkhwa',
        'website': 'https://hed.gkp.pk',
        'education_level': 'Undergraduate',
        'province': 'Khyber Pakhtunkhwa',
        'field_of_study': 'Selected disciplines at approved institutions',
        'eligibility': (
            'KPK domicile; merit-cum-affordability; monthly family income < Rs 100,000.'
        ),
        'coverage': 'Full educational expenses + Rs 5,000/month stipend.',
        'required_documents': 'KPK domicile, income certificate, admission proof, academic records.',
        'application_deadline': 'As announced by the approved institution / HED',
        'application_process': 'Apply directly to the selected/approved institution.',
        'contact': 'Higher Education Department, KPK',
        'source_url': 'https://hed.gkp.pk',
        'min_marks': None,
    },
    {
        'name': "Prime Minister's Fee Reimbursement Scheme",
        'provider': 'Government of Pakistan (via HEC)',
        'website': 'https://www.hec.gov.pk',
        'education_level': 'Postgraduate',
        'province': 'Balochistan and other less-developed areas',
        'field_of_study': 'Any',
        'eligibility': (
            'Domicile of less-developed areas (Balochistan, GB, FATA, Interior Sindh, South Punjab, etc.). '
            'Currently closed for new registrations; only continuing students are funded.'
        ),
        'coverage': 'Reimbursement of tuition, admission, and library fees.',
        'required_documents': 'Domicile of eligible area, university enrollment proof, fee vouchers.',
        'application_deadline': 'Closed for new registrations',
        'application_process': 'Continuing students only; new intake is currently closed.',
        'contact': 'HEC',
        'source_url': 'https://www.hec.gov.pk',
        'min_marks': None,
    },
    {
        'name': "Provincial Chief Minister's Scholarship Programs (Punjab Honhaar)",
        'provider': 'Respective provincial governments (Punjab HEC Honhaar example)',
        'website': 'https://honhaarscholarship.punjabhec.gov.pk',
        'education_level': 'Undergraduate',
        'province': 'Punjab (other provinces run similar CM schemes)',
        'field_of_study': '60–80 priority disciplines (Engineering, Medicine, IT, AI, etc.)',
        'eligibility': (
            'Punjab domicile; monthly income < Rs 300,000; enrolled in 1st or 3rd–5th semester.'
        ),
        'coverage': '100% tuition fee waiver; 30,000+ scholarships/year.',
        'required_documents': 'Punjab domicile, income proof, university enrollment, CNIC/B-form.',
        'application_deadline': 'As announced on the Honhaar portal',
        'application_process': 'Apply via https://honhaarscholarship.punjabhec.gov.pk',
        'contact': 'Punjab HEC Honhaar portal',
        'source_url': 'https://honhaarscholarship.punjabhec.gov.pk',
        'min_marks': None,
    },
]


class Command(BaseCommand):
    help = 'Seed government scholarship spreadsheet records'

    def handle(self, *args, **options):
        created = 0
        updated = 0
        for row in SCHOLARSHIPS:
            _, was_created = Scholarship.objects.update_or_create(
                name=row['name'],
                defaults={
                    **row,
                    'collected_by': BY,
                    'date_collected': COLLECTED,
                },
            )
            created += int(was_created)
            updated += int(not was_created)
        self.stdout.write(self.style.SUCCESS(
            f'Seeded scholarships: {created} created, {updated} updated, total {Scholarship.objects.count()}'
        ))
