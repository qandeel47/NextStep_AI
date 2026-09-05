from rest_framework.throttling import UserRateThrottle


class CounselorMessageThrottle(UserRateThrottle):
    scope = 'counselor'
