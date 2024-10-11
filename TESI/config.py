import os
from algorithms import get_best_by_genre, get_most_watched, get_random_recommendations

TMDB_API_KEY = '9e6c375b125d733d9ce459bdd91d4a06'
TMDB_BASE_URL = 'https://api.themoviedb.org/3/movie'


MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb+srv://utenteProva:utenteProva123@cluster0.3iblz3a.mongodb.net/Users?retryWrites=true&w=majority&appName=Cluster0')

SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key')

TESTS = [
    {
        'id': 'testA',
        'algorithm': 'get_random_recommendations',
        'visualization': 'scroll',
        'percentage': 33
    },
    {
        'id': 'testB',
        'algorithm': 'get_most_watched',
        'visualization': 'list',
        'percentage': 33
    },
    {
        'id': 'testC',
        'algorithm': 'get_best_by_genre',
        'visualization': 'lines',
        'percentage': 33
    }
]