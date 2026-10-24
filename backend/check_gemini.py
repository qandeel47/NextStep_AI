import os, json, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.conf import settings
import urllib.error
from urllib.request import Request, urlopen

keys = getattr(settings, 'GEMINI_API_KEYS', None) or [getattr(settings, 'GEMINI_API_KEY', '')]
key = keys[0]
print('Key found:', bool(key), '| length:', len(key))
print('Model in settings:', settings.GEMINI_MODEL)

req = Request('https://generativelanguage.googleapis.com/v1beta/models',
              headers={'x-goog-api-key': key})
try:
    data = json.loads(urlopen(req, timeout=20).read())
    print('\nConnection OK. Models you can use:')
    for m in data.get('models', []):
        if 'generateContent' in m.get('supportedGenerationMethods', []):
            print('  ', m['name'].replace('models/', ''))
except urllib.error.HTTPError as e:
    print('\nHTTP error', e.code, e.read()[:400])
except Exception as e:
    print('\nNetwork error:', type(e).__name__, e)