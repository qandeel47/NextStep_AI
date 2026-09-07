from django.http import JsonResponse


def api_root(request):
    return JsonResponse({
        'name': 'NextStep AI API',
        'health': '/health/',
        'docs': '/api/docs/',
    })


def health_check(request):
    return JsonResponse({'status': 'ok'})
