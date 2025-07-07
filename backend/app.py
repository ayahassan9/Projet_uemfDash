from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
import os
import pandas as pd
import json
import traceback

# Importer les services
from services.data_service import data_service
from services.statistics_service import statistics_service
from services.prediction_service import prediction_service

app = Flask(__name__)
CORS(app)  # Activer CORS pour permettre les requêtes depuis le frontend

# Routes pour les données générales
@app.route('/api/data/summary', methods=['GET'])
def get_data_summary():
    """Renvoie un résumé des données chargées"""
    try:
        summary = data_service.get_data_summary()
        if not summary:
            return jsonify({"error": "Aucune donnée n'a été chargée"}), 500
        
        return jsonify(summary)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# Routes pour les statistiques
@app.route('/api/statistics/gender', methods=['GET'])
def get_gender_statistics():
    """Renvoie des statistiques sur le genre"""
    try:
        stats = statistics_service.get_gender_statistics()
        if not stats:
            return jsonify({"error": "Aucune statistique disponible"}), 500
        
        return jsonify(stats)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/statistics/nationality', methods=['GET'])
def get_nationality_statistics():
    """Renvoie des statistiques sur la nationalité"""
    try:
        stats = statistics_service.get_nationality_statistics()
        if not stats:
            return jsonify({"error": "Aucune statistique disponible"}), 500
        
        return jsonify(stats)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/statistics/city', methods=['GET'])
def get_city_statistics():
    """Renvoie des statistiques sur les villes"""
    try:
        stats = statistics_service.get_city_statistics()
        if not stats:
            return jsonify({"error": "Aucune statistique disponible"}), 500
        
        return jsonify(stats)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/statistics/bac-type', methods=['GET'])
def get_bac_type_statistics():
    """Renvoie des statistiques sur les types de baccalauréat"""
    try:
        stats = statistics_service.get_bac_type_statistics()
        if not stats:
            return jsonify({"error": "Aucune statistique disponible"}), 500
        
        return jsonify(stats)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/statistics/school-specialty', methods=['GET'])
def get_school_specialty_statistics():
    """Renvoie des statistiques sur les écoles et spécialités"""
    try:
        stats = statistics_service.get_school_specialty_statistics()
        if not stats:
            return jsonify({"error": "Aucune statistique disponible"}), 500
        
        return jsonify(stats)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/statistics/scholarship', methods=['GET'])
def get_scholarship_statistics():
    """Renvoie des statistiques sur les bourses"""
    try:
        stats = statistics_service.get_scholarship_statistics()
        if not stats:
            return jsonify({"error": "Aucune statistique disponible"}), 500
        
        return jsonify(stats)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/statistics/mark-correlations', methods=['GET'])
def get_mark_correlations():
    """Renvoie des corrélations entre les notes et d'autres facteurs"""
    try:
        stats = statistics_service.get_mark_correlations()
        if not stats:
            return jsonify({"error": "Aucune statistique disponible"}), 500
        
        return jsonify(stats)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# Routes pour les prédictions
@app.route('/api/predictions/graduation', methods=['POST'])
def predict_graduation():
    """Prédiction de diplomation"""
    try:
        # Récupérer les données de la requête
        student_data = request.json
        
        if not student_data:
            return jsonify({"error": "Données étudiantes requises"}), 400
        
        # Effectuer la prédiction
        result = prediction_service.predict_graduation(student_data)
        
        if not result:
            return jsonify({"error": "Impossible de générer une prédiction"}), 500
        
        return jsonify(result)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/predictions/specialty', methods=['POST'])
def predict_specialty():
    """Prédiction de spécialité"""
    try:
        # Récupérer les données de la requête
        student_data = request.json
        
        if not student_data:
            return jsonify({"error": "Données étudiantes requises"}), 400
        
        # Effectuer la prédiction
        result = prediction_service.predict_specialty(student_data)
        
        if not result:
            return jsonify({"error": "Impossible de générer une prédiction"}), 500
        
        return jsonify(result)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/predictions/faculty-revenue', methods=['GET'])
def predict_faculty_revenue():
    """Prédiction des revenus par faculté"""
    try:
        result = prediction_service.predict_faculty_revenue()
        
        if not result:
            return jsonify({"error": "Impossible de générer une prédiction"}), 500
        
        return jsonify(result)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/predictions/next-year-students', methods=['GET'])
def predict_next_year_students():
    """Prédiction du nombre d'étudiants pour l'année prochaine"""
    try:
        result = prediction_service.predict_next_year_students()
        
        if not result:
            return jsonify({"error": "Impossible de générer une prédiction"}), 500
        
        return jsonify(result)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/predictions/average-fee', methods=['GET'])
def predict_average_fee():
    """Prédiction des frais moyens"""
    try:
        result = prediction_service.predict_average_fee()
        
        if not result:
            return jsonify({"error": "Impossible de générer une prédiction"}), 500
        
        return jsonify(result)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# Route pour l'upload de fichiers (maintenue pour compatibilité)
@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Point d'API pour télécharger un fichier CSV"""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "Aucun fichier n'a été téléchargé"}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"error": "Aucun fichier sélectionné"}), 400
        
        if not file.filename.endswith('.csv'):
            return jsonify({"error": "Seuls les fichiers CSV sont acceptés"}), 400
        
        # Sauvegarder le fichier
        import os
        data_path = os.path.join(os.path.dirname(__file__), 'data', 'students.csv')
        os.makedirs(os.path.dirname(data_path), exist_ok=True)
        file.save(data_path)
        
        # Recharger les données
        success = data_service.load_data()
        
        if not success:
            return jsonify({"error": "Impossible de charger les données du fichier"}), 400
        
        # Créer un résumé des données
        summary = data_service.get_data_summary()
        
        return jsonify({"message": "Fichier téléchargé et données chargées avec succès", "summary": summary})
        
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# Point d'entrée principal
if __name__ == "__main__":
    # S'assurer que les données sont chargées au démarrage
    if not data_service.df is None:
        print(f"Données chargées: {len(data_service.df)} étudiants")
    else:
        print("AVERTISSEMENT: Aucune donnée n'a été chargée")
    
    # Démarrer le serveur Flask
    app.run(debug=True)
