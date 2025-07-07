#!/usr/bin/env python3
"""
Module pour analyser le schéma du fichier CSV et adapter le système.
Ce module permet de s'assurer que toutes les statistiques et prédictions
sont compatibles avec la structure spécifique du fichier de données.
"""

import os
import csv
import json
from collections import defaultdict

def analyze_csv_schema(file_path, sample_rows=None):
    """
    Analyse la structure d'un fichier CSV et retourne des informations sur son schéma.
    
    Args:
        file_path: Chemin vers le fichier CSV à analyser
        sample_rows: Nombre de lignes à analyser (None pour toutes)
    
    Returns:
        Un dictionnaire contenant les informations de schéma
    """
    if not os.path.exists(file_path):
        print(f"Erreur: Le fichier {file_path} n'existe pas")
        return None
        
    try:
        # Vérifier la taille du fichier
        file_size_mb = os.path.getsize(file_path) / (1024 * 1024)
        is_large_file = file_size_mb > 50  # Plus de 50 MB est considéré comme grand
        
        if is_large_file and sample_rows is None:
            print(f"Le fichier est volumineux ({file_size_mb:.1f} MB). Limitation à 50,000 lignes pour l'analyse.")
            sample_rows = 50000
            
        # Identifier les colonnes et leur type
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            headers = next(reader)
            
            # Structures pour l'analyse
            column_types = {}
            column_samples = {}
            column_values = defaultdict(set)
            column_stats = {}
            row_count = 0
            
            # Analyser un échantillon de données
            max_analysis_rows = sample_rows or 1000
            
            for i, row in enumerate(reader):
                if sample_rows and i >= sample_rows:
                    break
                    
                row_count += 1
                if len(row) != len(headers):
                    continue
                    
                # Pour chaque colonne, détecter le type et collecter des échantillons
                for j, (header, cell) in enumerate(zip(headers, row)):
                    if i < max_analysis_rows:  # Limite pour les valeurs uniques
                        if len(column_values[header]) < 1000:  # Limiter le nombre de valeurs uniques stockées
                            column_values[header].add(cell)
                    
                    # Conserver quelques exemples
                    if header not in column_samples:
                        column_samples[header] = []
                    if len(column_samples[header]) < 5 and cell:
                        column_samples[header].append(cell)
                    
                    # Déterminer le type
                    if header not in column_types:
                        column_types[header] = 'string'  # Type par défaut
                    
                    # Vérifier si nombre
                    try:
                        float(cell)
                        if column_types[header] == 'string':
                            column_types[header] = 'number'
                    except ValueError:
                        # Vérifier si booléen
                        if cell.lower() in ['true', 'false']:
                            column_types[header] = 'boolean'
                        # Vérifier si JSON
                        elif cell.startswith('{') and cell.endswith('}'):
                            try:
                                json.loads(cell)
                                column_types[header] = 'json'
                            except:
                                pass
                        # Vérifier si date
                        elif '-' in cell and len(cell) >= 8:
                            parts = cell.split('-')
                            if len(parts) == 3 and all(p.isdigit() for p in parts):
                                column_types[header] = 'date'
                
                # Afficher des indicateurs de progression pour les fichiers volumineux
                if is_large_file and i % 10000 == 0 and i > 0:
                    print(f"  Analyse du schéma: {i} lignes traitées...")
            
            # Compter les lignes totales si échantillonnage
            total_rows = row_count
            if sample_rows:
                # Estimer le nombre total de lignes
                with open(file_path, 'r', encoding='utf-8') as count_file:
                    # Avancer jusqu'à l'en-tête
                    next(count_file)
                    # Compter le reste des lignes
                    for i, _ in enumerate(count_file):
                        pass
                    total_rows = i + 1
            
            # Collecter des statistiques pour chaque colonne
            for header in headers:
                unique_values = len(column_values[header])
                column_stats[header] = {
                    'unique_values': unique_values,
                    'cardinality': round(unique_values / max(1, sample_rows or row_count), 3),
                    'samples': column_samples.get(header, [])
                }
            
            # Détecter les colonnes de semestre
            semester_columns = [col for col in headers if col.startswith('S') and col[1:].isdigit()]
            
            schema_result = {
                'headers': headers,
                'column_types': column_types,
                'column_stats': column_stats,
                'semester_columns': semester_columns,
                'row_count': total_rows,
                'analyzed_rows': row_count,
                'is_sampled': sample_rows is not None and row_count >= sample_rows
            }
            
            return schema_result
            
    except Exception as e:
        print(f"Erreur lors de l'analyse du schéma: {e}")
        import traceback
        traceback.print_exc()
        return None

def get_available_features(schema):
    """
    Identifie les fonctionnalités statistiques disponibles en fonction du schéma.
    
    Args:
        schema: Dictionnaire de schéma retourné par analyze_csv_schema
    
    Returns:
        Liste des fonctionnalités statistiques disponibles
    """
    if not schema:
        return []
    
    headers = schema['headers']
    types = schema['column_types']
    features = []
    
    # Statistiques de base toujours disponibles
    features.append('data_summary')
    
    # Statistiques par genre
    if 'Gender' in headers:
        features.append('gender_stats')
    
    # Statistiques par nationalité
    if 'Nationality' in headers:
        features.append('nationality_stats')
    
    # Statistiques par ville
    if 'City' in headers:
        features.append('city_stats')
    
    # Statistiques par type de bac
    if 'Baccalaureat_Type' in headers:
        features.append('bac_type_stats')
    
    # Statistiques école-spécialité
    if 'School' in headers and 'Specialty' in headers:
        features.append('school_specialty_stats')
    
    # Statistiques bourse
    if 'Scholarship' in headers:
        features.append('scholarship_stats')
    
    # Corrélations de notes
    mark_related_columns = ['Mark'] + schema.get('semester_columns', [])
    if any(col in headers for col in mark_related_columns):
        features.append('mark_correlations')
    
    # Prédictions de réussite
    if 'Mark' in headers and 'Graduated' in headers:
        features.append('graduation_prediction')
    
    # Prédictions de spécialité
    if 'Mark' in headers and 'Baccalaureat_Type' in headers and 'Specialty' in headers:
        features.append('specialty_prediction')
    
    # Autres prédictions
    if 'School' in headers and 'Start_Year' in headers:
        features.append('faculty_revenue')
        features.append('next_year_students')
        features.append('average_fee')
    
    return features

if __name__ == "__main__":
    import sys
    
    # Utiliser le fichier fourni ou le fichier par défaut
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    default_csv = os.path.join(data_dir, 'students.csv')
    file_path = sys.argv[1] if len(sys.argv) > 1 else default_csv
    
    print(f"Analyse du fichier CSV: {file_path}")
    schema = analyze_csv_schema(file_path)
    
    if schema:
        print("\n=== Schéma détecté ===")
        print(f"Nombre de lignes: {schema['row_count']}")
        print(f"Colonnes ({len(schema['headers'])}):")
        
        for col in schema['headers']:
            type_info = schema['column_types'].get(col, 'unknown')
            stats = schema['column_stats'].get(col, {})
            unique = stats.get('unique_values', '?')
            cardinality = stats.get('cardinality', 0)
            samples = ', '.join(str(s) for s in stats.get('samples', [])[:3])
            
            if cardinality < 0.01:
                note = "très faible cardinalité"
            elif cardinality < 0.1:
                note = "faible cardinalité"
            elif cardinality > 0.9:
                note = "haute cardinalité"
            else:
                note = ""
            
            print(f"  - {col}: {type_info} ({unique} valeurs uniques) {note}")
            if samples:
                print(f"    Exemples: {samples}")
        
        print("\nColonnes de semestre détectées:", schema['semester_columns'])
        
        print("\n=== Fonctionnalités disponibles ===")
        features = get_available_features(schema)
        for feature in features:
            print(f"- {feature}")
        
        if not features:
            print("Aucune fonctionnalité disponible avec le schéma actuel")
