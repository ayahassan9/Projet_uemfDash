import pandas as pd
import os
import json
import sys

def load_simple_data():
    """
    Charge les données de façon simplifiée, sans essayer de parser le JSON
    """
    try:
        # Utiliser le fichier clean directement s'il existe
        simple_path = os.path.join(os.path.dirname(__file__), 'sample_data', 'euromed_students_clean.csv')
        
        if not os.path.exists(simple_path):
            print(f"Le fichier {simple_path} n'existe pas.")
            # Utiliser le fichier original
            original_path = os.path.join(os.path.dirname(__file__), 'sample_data', 'euromed_students.csv')
            
            if not os.path.exists(original_path):
                print(f"Le fichier {original_path} n'existe pas non plus.")
                return None
                
            # Copier en supprimant la première ligne si c'est un commentaire
            with open(original_path, 'r', encoding='utf-8') as infile:
                lines = infile.readlines()
                
            if lines and lines[0].strip().startswith('//'):
                lines = lines[1:]  # Supprimer la première ligne
                
            with open(simple_path, 'w', encoding='utf-8') as outfile:
                outfile.writelines(lines)
                
            print(f"Fichier nettoyé créé à {simple_path}")
        
        # Charger le CSV sans traiter les colonnes JSON pour l'instant
        df = pd.read_csv(simple_path)
        
        # Convertir les colonnes booléennes
        bool_cols = ['Scholarship', 'Graduated']
        for col in bool_cols:
            df[col] = df[col].astype(str).map({'True': True, 'False': False})
        
        print(f"Données chargées avec succès: {len(df)} étudiants")
        return df
        
    except Exception as e:
        print(f"Erreur lors du chargement des données: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    df = load_simple_data()
    if df is not None:
        print("\n=== Aperçu des données ===")
        print(df.head())
        
        # Afficher quelques statistiques de base
        print("\n=== Statistiques des données ===")
        print(f"Nombre total d'étudiants: {len(df)}")
        print(f"Distribution par genre: {df['Gender'].value_counts().to_dict()}")
        print(f"Nationalités: {df['Nationality'].value_counts().to_dict()}")
