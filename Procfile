release: python manage.py makemigrations && python manage.py migrate 
web: gunicorn backend.wsgi --log-file -
