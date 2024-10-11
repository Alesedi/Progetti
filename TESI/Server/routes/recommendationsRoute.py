from flask import request, jsonify
from algorithms import get_best_by_genre,get_most_watched, get_random_recommendations
from config import TESTS

algorithm_mapping = {
    'get_random_recommendations': get_random_recommendations,
    'get_most_watched': get_most_watched,
    'get_best_by_genre': get_best_by_genre
}

def register_routes(app):
    @app.route('/recommendations', methods=['GET'])
    def run_recommendation_test():
        # Recupera il test dalla richiesta
        
        test_id = request.args.get('test_id')

        # Verifica se il test_id è stato fornito
        if not test_id:
            return jsonify({'error': 'Test ID is required'}), 400

        # Trova il test corrispondente nel file di configurazione
        selected_test = next((test for test in TESTS if test['id'] == test_id), None)

        # Verifica se il test esiste
        if not selected_test:
            return jsonify({'error': 'Invalid test ID'}), 404

        # Ottiene il nome dell'algoritmo associato a questo test
        algorithm_name = selected_test['algorithm']

        # Usa globals() per ottenere la funzione dall'algoritmo specificato come stringa
        algorithm = algorithm_mapping.get(algorithm_name)

            # Verifica se l'algoritmo esiste
        if algorithm:
            recommendations = algorithm()
        else:
            return jsonify({'error': 'Algorithm not found'}), 500

        # Restituiamo il risultato
        return recommendations
