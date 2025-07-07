#!/usr/bin/env python3
"""
Script pour adapter vos données au format attendu par le tableau de bord Euromed Analytics.
Ce script:
1. Vérifie vos données d'entrée
2. Convertit les données au format attendu
3. Sauvegarde le résultat dans le dossier data/
"""

import os
import sys
import csv
import json
import shutil
from datetime import datetime
import random

# Configuration des répertoires
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, 'data')
SAMPLE_DIR = os.path.join(SCRIPT_DIR, 'sample_data')

# Colonnes attendues par le système
REQUIRED_COLUMNS = [
    'ID', 'Name', 'Gender', 'Nationality', 'City', 'Birth_Date', 
    'Baccalaureat_Type', 'Mark', 'School', 'Specialty', 
    'Start_Year', 'Scholarship', 'Current_Status', 'Graduated'
]

SEMESTER_COLUMNS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12']

# Valeurs par défaut pour les champs optionnels
DEFAULT_VALUES = {
    'Gender': ['Male', 'Female'],
    'Nationality': 'Moroccan',
    'City': ['Casablanca', 'Rabat', 'Marrakech', 'Fez', 'Tangier'],
    'Baccalaureat_Type': ['Scientific', 'Literary', 'Economic', 'Technical', 'Foreign'],
    'School': ['Business School', 'Engineering School', 'Medical School', 'Law School', 'IT School', 'Arts School'],
    'Specialty': {
        'Business School': ['Finance', 'Marketing', 'Management', 'Accounting', 'International Business'],
        'Engineering School': ['Computer Science', 'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering'],
        'Medical School': ['Medicine', 'Pharmacy', 'Nursing', 'Biotechnology'],
        'Law School': ['Corporate Law', 'Public Law', 'International Law', 'Criminal Law'],
        'IT School': ['Data Science', 'Software Engineering', 'Information Systems', 'Cybersecurity'],
        'Arts School': ['Visual Arts', 'Graphic Design', 'Interior Design', 'Digital Arts']
    },
    'Current_Status': ['Active', 'Graduated', 'Dropped', 'On Leave']
}

def ensure_directory(directory):
    """S'assure qu'un répertoire existe, le crée si nécessaire"""
    if not os.path.exists(directory):
        os.makedirs(directory)
        print(f"✅ Répertoire créé: {directory}")

def load_csv_file(file_path):
    """Charge un fichier CSV et retourne ses données"""
    try:
        with open(file_path, 'r', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            headers = next(reader)
            data = []
            for row in reader:
                if len(row) == len(headers):
                    data.append(dict(zip(headers, row)))
            
            print(f"✅ Fichier chargé avec {len(data)} lignes et {len(headers)} colonnes")
            return headers, data
    except Exception as e:
        print(f"❌ Erreur lors du chargement du fichier: {str(e)}")
        return None, None

def save_csv_file(file_path, headers, data):
    """Sauvegarde des données au format CSV"""
    try:
        with open(file_path, 'w', encoding='utf-8', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(headers)
            for row in data:
                writer.writerow([row.get(col, '') for col in headers])
        
        print(f"✅ Données sauvegardées dans {file_path}")
        return True
    except Exception as e:
        print(f"❌ Erreur lors de la sauvegarde: {str(e)}")
        return False

def adapt_data(input_data, input_headers):
    """
    Adapte les données au format attendu par le système
    """
    output_data = []
    all_headers = REQUIRED_COLUMNS + SEMESTER_COLUMNS
    
    # Créer un mappage des colonnes d'entrée vers les colonnes attendues
    column_mapping = {}
    for required in REQUIRED_COLUMNS:
        # Chercher une correspondance exacte
        if required in input_headers:
            column_mapping[required] = required
        else:
            # Chercher une correspondance approximative (ignorer la casse, espaces, etc.)
            matches = []
            required_lower = required.lower().replace('_', ' ')
            for header in input_headers:
                header_lower = header.lower().replace('_', ' ')
                if required_lower in header_lower or header_lower in required_lower:
                    matches.append(header)
            
            if matches:
                if len(matches) == 1:
                    column_mapping[required] = matches[0]
                else:
                    print(f"⚠️ Plusieurs correspondances possibles pour '{required}': {matches}")
                    user_choice = input(f"Choisissez la colonne à utiliser pour '{required}' (numéro ou 'n' pour aucune): ")
                    if user_choice.isdigit() and 0 <= int(user_choice) < len(matches):
                        column_mapping[required] = matches[int(user_choice)]
                    else:
                        column_mapping[required] = None
            else:
                column_mapping[required] = None
    
    print("\n=== Mapping des colonnes ===")
    for required, mapped in column_mapping.items():
        status = "✅" if mapped else "❌"
        print(f"{status} {required} → {mapped if mapped else 'Non trouvé'}")
    
    # Vérifier les colonnes manquantes importantes
    missing_important = [col for col in ['ID', 'Name', 'Mark'] if column_mapping.get(col) is None]
    if missing_important:
        print(f"\n❌ Colonnes critiques manquantes: {', '.join(missing_important)}")
        choice = input("Ces colonnes sont essentielles. Voulez-vous continuer quand même ? (o/n): ")
        if choice.lower() != 'o':
            return None
    
    # Pour chaque ligne de données, créer une entrée adaptée
    for row_num, row in enumerate(input_data, 1):
        new_row = {}
        
        # Traiter les colonnes requises
        for required_col in REQUIRED_COLUMNS:
            mapped_col = column_mapping.get(required_col)
            
            # Si on a trouvé une colonne correspondante, utiliser sa valeur
            if mapped_col:
                new_row[required_col] = row.get(mapped_col, '')
            # Sinon générer une valeur par défaut
            else:
                if required_col == 'ID':
                    new_row[required_col] = f"E{1000 + row_num}"
                elif required_col == 'Name':
                    new_row[required_col] = f"Student_{row_num}"
                elif required_col == 'Gender':
                    new_row[required_col] = random.choice(DEFAULT_VALUES['Gender'])
                elif required_col == 'Nationality':
                    new_row[required_col] = DEFAULT_VALUES['Nationality']
                elif required_col == 'City':
                    new_row[required_col] = random.choice(DEFAULT_VALUES['City'])
                elif required_col == 'Birth_Date':
                    # Générer une date entre 1995-2005
                    year = random.randint(1995, 2005)
                    month = random.randint(1, 12)
                    day = random.randint(1, 28)
                    new_row[required_col] = f"{year}-{month:02d}-{day:02d}"
                elif required_col == 'Baccalaureat_Type':
                    new_row[required_col] = random.choice(DEFAULT_VALUES['Baccalaureat_Type'])
                elif required_col == 'Mark':
                    # Valeur entre 10-20 avec une décimale
                    new_row[required_col] = str(round(random.uniform(10, 20), 1))
                elif required_col == 'School':
                    new_row[required_col] = random.choice(DEFAULT_VALUES['School'])
                elif required_col == 'Specialty':
                    school = new_row.get('School', random.choice(DEFAULT_VALUES['School']))
                    specialties = DEFAULT_VALUES['Specialty'].get(school, ['Unknown'])
                    new_row[required_col] = random.choice(specialties)
                elif required_col == 'Start_Year':
                    new_row[required_col] = str(random.randint(2017, 2023))
                elif required_col == 'Scholarship':
                    new_row[required_col] = str(random.choice([True, False]))
                elif required_col == 'Current_Status':
                    new_row[required_col] = random.choice(DEFAULT_VALUES['Current_Status'])
                elif required_col == 'Graduated':
                    # Si status est "Graduated", alors True, sinon selon probabilité
                    if new_row.get('Current_Status') == 'Graduated':
                        new_row[required_col] = 'True'
                    else:
                        new_row[required_col] = str(random.random() < 0.3)  # 30% de chance
        
        # Générer des notes de semestre cohérentes
        start_year = int(new_row.get('Start_Year', datetime.now().year - 3))
        current_year = datetime.now().year
        years_passed = current_year - start_year
        max_semesters = min(years_passed * 2, 12)  # Maximum de 12 semestres (6 ans)
        
        # Marque de base à partir du bac, ou valeur par défaut
        try:
            base_mark = float(new_row.get('Mark', 15.0))
        except:
            base_mark = 15.0
        
        # Générer des notes pour chaque semestre
        for i in range(1, 13):
            semester_key = f"S{i}"
            
            if i <= max_semesters:
                # Petite variation autour de la note de base avec tendance à l'amélioration
                semester_mark = base_mark + random.uniform(-1, 2) + (i / max_semesters)
                semester_mark = max(8, min(20, round(semester_mark, 1)))  # Entre 8 et 20
                new_row[semester_key] = json.dumps({"mark": semester_mark})
            else:
                new_row[semester_key] = ""
        
        output_data.append(new_row)
    
    return all_headers, output_data

def display_menu():
    """Affiche le menu principal"""
    print("\n=== Adaptation de données pour Euromed Analytics ===")
    print("1. Importer et adapter mes données")
    print("2. Utiliser les exemples fournis")
    print("3. Voir les colonnes requises")
    print("4. Aide sur le format des données")
    print("5. Quitter")
    choice = input("\nVotre choix (1-5): ")
    return choice

def show_required_columns():
    """Affiche les colonnes requises et leur description"""
    print("\n=== Colonnes requises ===")
    descriptions = {
        'ID': 'Identifiant unique de l\'étudiant (ex: E001, E002, ...)',
        'Name': 'Nom complet de l\'étudiant',
        'Gender': 'Genre (Male/Female)',
        'Nationality': 'Nationalité (ex: Moroccan, French, ...)',
        'City': 'Ville d\'origine',
        'Birth_Date': 'Date de naissance (format YYYY-MM-DD)',
        'Baccalaureat_Type': 'Type de baccalauréat (Scientific, Literary, Economic, ...)',
        'Mark': 'Note au baccalauréat (entre 0 et 20)',
        'School': 'École/Faculté (ex: Business School, Engineering School, ...)',
        'Specialty': 'Spécialité (ex: Finance, Computer Science, ...)',
        'Start_Year': 'Année de début des études (ex: 2018)',
        'Scholarship': 'Boursier (True/False)',
        'Current_Status': 'Statut actuel (Active, Graduated, Dropped, On Leave)',
        'Graduated': 'A obtenu son diplôme (True/False)'
    }
    
    for col in REQUIRED_COLUMNS:
        print(f"- {col}: {descriptions.get(col, 'Pas de description disponible')}")
    
    print("\nColonnes de semestres (optionnelles mais recommandées):")
    print("- S1, S2, S3, ..., S12: Notes par semestre au format JSON: {\"mark\": 15.5}")
    
    input("\nAppuyez sur Entrée pour continuer...")

def show_help():
    """Affiche l'aide sur le format des données"""
    print("\n=== Guide de formatage des données ===")
    print("""
Pour que vos données fonctionnent correctement avec l'application:

1. Format CSV:
   - Utilisez le format CSV avec en-têtes
   - Les colonnes peuvent être dans n'importe quel ordre
   - Les noms de colonnes peuvent être différents (le script tentera de les faire correspondre)

2. Valeurs importantes:
   - Mark (note): nombre entre 0 et 20, avec ou sans décimale
   - Scholarship et Graduated: valeurs True/False (sans guillemets)
   - Start_Year: année à 4 chiffres (ex: 2018)
   - Les valeurs des semestres (S1-S12): format JSON {"mark": 15.5}

3. Valeurs manquantes:
   - Le script tentera de générer des valeurs par défaut cohérentes
   - Les ID seront générés automatiquement si absents
   - Les notes de semestres seront générées en fonction de la note au bac

4. Exemple de ligne CSV valide:
   E001,Ahmed Alaoui,Male,Moroccan,Casablanca,2000-05-12,Scientific,16.8,Business School,Finance,2018,True,Graduated,True,{"mark":15.7},{"mark":16.2},...
    """)
    
    input("\nAppuyez sur Entrée pour continuer...")

def copy_sample_data():
    """Copie les données d'exemple vers le dossier data"""
    ensure_directory(DATA_DIR)
    
    source_file = os.path.join(SAMPLE_DIR, 'euromed_students_clean.csv')
    target_file = os.path.join(DATA_DIR, 'students.csv')
    
    if not os.path.exists(source_file):
        print(f"❌ Fichier d'exemple introuvable: {source_file}")
        return False
    
    try:
        shutil.copy(source_file, target_file)
        print(f"✅ Données d'exemple copiées avec succès vers: {target_file}")
        return True
    except Exception as e:
        print(f"❌ Erreur lors de la copie des données d'exemple: {str(e)}")
        return False

def main():
    """Fonction principale"""
    ensure_directory(DATA_DIR)
    
    while True:
        choice = display_menu()
        
        if choice == '1':
            # Importer et adapter les données
            file_path = input("\nChemin vers votre fichier CSV: ").strip()
            if not os.path.exists(file_path):
                print(f"❌ Fichier introuvable: {file_path}")
                continue
            
            headers, data = load_csv_file(file_path)
            if not headers or not data:
                continue
            
            adapted_headers, adapted_data = adapt_data(data, headers)
            if not adapted_data:
                print("❌ Échec de l'adaptation des données.")
                continue
            
            # Sauvegarder les données adaptées
            output_path = os.path.join(DATA_DIR, 'students.csv')
            if save_csv_file(output_path, adapted_headers, adapted_data):
                print("\n✅ Données adaptées et sauvegardées avec succès!")
                print(f"📊 Le fichier est prêt à être utilisé par l'application: {output_path}")
                backup_path = os.path.join(DATA_DIR, f"students_original_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv")
                shutil.copy(file_path, backup_path)
                print(f"💾 Une copie de vos données originales a été conservée: {backup_path}")
            
            input("\nAppuyez sur Entrée pour revenir au menu principal...")
        
        elif choice == '2':
            # Utiliser les exemples fournis
            if copy_sample_data():
                print("\n✅ Les données d'exemple sont prêtes à être utilisées.")
            input("\nAppuyez sur Entrée pour revenir au menu principal...")
        
        elif choice == '3':
            # Voir les colonnes requises
            show_required_columns()
        
        elif choice == '4':
            # Aide sur le format des données
            show_help()
        
        elif choice == '5':
            print("\nMerci d'avoir utilisé l'outil d'adaptation de données!")
            sys.exit(0)
        
        else:
            print("\n⚠️ Option invalide, veuillez réessayer.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nOpération annulée par l'utilisateur.")
        sys.exit(0)
