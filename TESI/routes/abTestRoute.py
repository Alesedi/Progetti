from flask import request, jsonify
from auth.userModel import User 
from config import TESTS
def register_routes_ab(app):
    @app.route('/runABTest', methods=['POST'])
    def run_ab_test():
        user_id = request.json.get('user_id')  # Ottieni l'ID dell'utente dalla richiesta

        # Verifica che l'ID dell'utente sia stato fornito
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        # Verifica se l'utente esiste nel database
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Verifica se all'utente è già stato assegnato un test
        

        # Conta quanti utenti sono già assegnati a ciascun test
        testA_count = User.count_by_assigned_test("testA")
        testB_count = User.count_by_assigned_test("testB")
        testC_count = User.count_by_assigned_test("testC")

        print(testA_count, testB_count, testC_count)

        # Conta il numero totale di utenti
        total_users = User.count_by_assigned_test()
        print(total_users)  # Senza parametro per contare tutti gli utenti

        # Definisci la distribuzione desiderata (30% per testA e testB, il resto per testC)
        test_distribution = {
            "testA": float(0.33 * total_users),
            "testB": float(0.33 * total_users),
            "testC": total_users - float(0.33 * total_users) * 2  # Resto per testC
        }
        print(test_distribution)

        # Determina quale test assegnare in base alla distribuzione attuale
        if testA_count < test_distribution["testA"]:
            assigned_test = next(test for test in TESTS if test['id'] == 'testA')
        elif testB_count < test_distribution["testB"]:
            assigned_test = next(test for test in TESTS if test['id'] == 'testB')
        else:
            assigned_test = next(test for test in TESTS if test['id'] == 'testC')

        # Assegna il test all'utente e aggiorna il database
        User.assign_test_to_user(user_id, assigned_test)

        # Restituisci la risposta JSON con il test assegnato
        return jsonify({
            'user_id': user_id,
            'assigned_test': assigned_test
        }), 200