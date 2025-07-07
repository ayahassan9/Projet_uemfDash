#!/usr/bin/env python3
"""
Un utilitaire pour traiter de grands ensembles de données par morceaux (chunks)
afin d'éviter les problèmes de mémoire et améliorer les performances.
"""

import os
import csv
import json
import gc
import time
import logging
from datetime import datetime

# Configuration du logging
logging.basicConfig(level=logging.INFO,
                   format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class DataChunker:
    """Classe pour traiter des fichiers CSV volumineux par chunks."""
    
    def __init__(self, file_path, chunk_size=5000, max_rows=None):
        """
        Initialiser le chunker.
        
        Args:
            file_path: Chemin vers le fichier CSV à traiter
            chunk_size: Nombre de lignes à traiter par chunk
            max_rows: Nombre maximum de lignes à traiter (None pour tout traiter)
        """
        self.file_path = file_path
        self.chunk_size = chunk_size
        self.max_rows = max_rows
        self.headers = None
        self.total_rows_processed = 0
        self.start_time = None
    
    def __enter__(self):
        """Support pour le context manager (with statement)."""
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Nettoyage à la sortie du context manager."""
        gc.collect()  # Force garbage collection
        end_time = time.time()
        if self.start_time:
            duration = end_time - self.start_time
            logger.info(f"Fin du traitement: {self.total_rows_processed} lignes en {duration:.2f}s " +
                       f"({self.total_rows_processed/duration:.2f} lignes/s)")
    
    def process_file(self, processor_func, *args, **kwargs):
        """
        Traite le fichier CSV par chunks en appelant processor_func sur chaque chunk.
        
        Args:
            processor_func: Fonction de traitement prenant (chunk, headers, *args, **kwargs)
            *args, **kwargs: Arguments supplémentaires à passer à processor_func
            
        Returns:
            Résultat cumulatif retourné par processor_func pour chaque chunk
        """
        if not os.path.exists(self.file_path):
            logger.error(f"Fichier non trouvé: {self.file_path}")
            return None
        
        result = None
        self.start_time = time.time()
        
        try:
            # Determiner la taille du fichier pour les rapports de progression
            file_size = os.path.getsize(self.file_path)
            logger.info(f"Début du traitement du fichier: {self.file_path} ({file_size / (1024*1024):.2f} MB)")
            
            with open(self.file_path, 'r', encoding='utf-8') as f:
                reader = csv.reader(f)
                self.headers = next(reader)
                
                chunk = []
                row_count = 0
                chunk_count = 0
                
                for row in reader:
                    row_count += 1
                    
                    if self.max_rows and row_count > self.max_rows:
                        break
                    
                    if len(row) != len(self.headers):
                        logger.warning(f"Ligne {row_count}: nombre de colonnes incorrect (ignorée)")
                        continue
                    
                    # Convertir la ligne en dictionnaire
                    record = {}
                    for i, header in enumerate(self.headers):
                        value = row[i].strip() if i < len(row) else ""
                        
                        # Convertir les booléens
                        if value.lower() == 'true':
                            value = True
                        elif value.lower() == 'false':
                            value = False
                        
                        # Essayer de parser les colonnes JSON (comme les semestres S1, S2, etc.)
                        elif header.startswith('S') and header[1:].isdigit() and value:
                            try:
                                value = json.loads(value)
                            except json.JSONDecodeError:
                                logger.warning(f"JSON invalide dans la colonne {header}: {value}")
                        
                        record[header] = value
                    
                    chunk.append(record)
                    
                    # Traiter le chunk quand il atteint la taille définie
                    if len(chunk) >= self.chunk_size:
                        chunk_count += 1
                        self.total_rows_processed += len(chunk)
                        
                        # Appeler la fonction de traitement
                        chunk_result = processor_func(chunk, self.headers, *args, **kwargs)
                        
                        # Combiner les résultats
                        if result is None:
                            result = chunk_result
                        elif chunk_result is not None:
                            if isinstance(result, dict) and isinstance(chunk_result, dict):
                                # Fusionner les dictionnaires
                                self._merge_dicts(result, chunk_result)
                            elif isinstance(result, list) and isinstance(chunk_result, list):
                                # Fusionner les listes
                                result.extend(chunk_result)
                            else:
                                # Utiliser la fonction de fusion personnalisée si fournie
                                merge_func = kwargs.get('merge_func')
                                if merge_func and callable(merge_func):
                                    result = merge_func(result, chunk_result)
                        
                        # Rapport de progression
                        progress_percent = min(100, (self.total_rows_processed / (self.max_rows or float('inf'))) * 100)
                        logger.info(f"Chunk {chunk_count} traité: {len(chunk)} lignes " +
                                   f"(total: {self.total_rows_processed}, {progress_percent:.1f}%)")
                        
                        # Nettoyer pour libérer la mémoire
                        chunk = []
                        gc.collect()
                
                # Traiter le dernier chunk s'il reste des données
                if chunk:
                    chunk_count += 1
                    self.total_rows_processed += len(chunk)
                    
                    chunk_result = processor_func(chunk, self.headers, *args, **kwargs)
                    
                    if result is None:
                        result = chunk_result
                    elif chunk_result is not None:
                        if isinstance(result, dict) and isinstance(chunk_result, dict):
                            self._merge_dicts(result, chunk_result)
                        elif isinstance(result, list) and isinstance(chunk_result, list):
                            result.extend(chunk_result)
                        else:
                            merge_func = kwargs.get('merge_func')
                            if merge_func and callable(merge_func):
                                result = merge_func(result, chunk_result)
                    
                    logger.info(f"Dernier chunk traité: {len(chunk)} lignes (total: {self.total_rows_processed})")
            
            return result
        
        except Exception as e:
            logger.error(f"Erreur lors du traitement du fichier: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    def _merge_dicts(self, dict1, dict2):
        """
        Fusionne récursivement dict2 dans dict1.
        - Les valeurs numériques sont additionnées
        - Les listes sont étendues
        - Les dictionnaires sont fusionnés récursivement
        - Les autres types sont remplacés par dict2
        """
        for key, value in dict2.items():
            if key in dict1:
                # Décider de la stratégie de fusion selon le type
                if isinstance(dict1[key], (int, float)) and isinstance(value, (int, float)):
                    dict1[key] += value
                elif isinstance(dict1[key], list) and isinstance(value, list):
                    dict1[key].extend(value)
                elif isinstance(dict1[key], dict) and isinstance(value, dict):
                    self._merge_dicts(dict1[key], value)
                else:
                    # Remplacer par la nouvelle valeur (ou utiliser une stratégie spécifique)
                    dict1[key] = value
            else:
                # Clé nouvelle, simplement ajouter
                dict1[key] = value

# Exemples de fonctions de traitement à utiliser avec DataChunker

def count_by_attribute(chunk, headers, attribute):
    """
    Compte les occurrences de chaque valeur d'un attribut.
    Example: count_by_attribute(chunk, headers, 'Gender')
    """
    counts = {}
    for record in chunk:
        value = record.get(attribute, "Unknown")
        if value not in counts:
            counts[value] = 0
        counts[value] += 1
    return counts

def calculate_statistics(chunk, headers):
    """
    Calcule diverses statistiques sur un chunk de données.
    """
    stats = {
        "total": len(chunk),
        "gender_counts": {},
        "nationality_counts": {},
        "scholarship_count": 0,
        "graduated_count": 0,
        "mark_sum": 0,
        "mark_count": 0
    }
    
    for record in chunk:
        # Comptes par genre
        gender = record.get("Gender", "Unknown")
        if gender not in stats["gender_counts"]:
            stats["gender_counts"][gender] = 0
        stats["gender_counts"][gender] += 1
        
        # Comptes par nationalité
        nationality = record.get("Nationality", "Unknown")
        if nationality not in stats["nationality_counts"]:
            stats["nationality_counts"][nationality] = 0
        stats["nationality_counts"][nationality] += 1
        
        # Compter les bourses et diplômés
        if record.get("Scholarship") is True:
            stats["scholarship_count"] += 1
        
        if record.get("Graduated") is True:
            stats["graduated_count"] += 1
        
        # Somme des notes pour calculer la moyenne
        try:
            mark = float(record.get("Mark", 0))
            stats["mark_sum"] += mark
            stats["mark_count"] += 1
        except:
            pass
    
    return stats

def merge_statistics(stats1, stats2):
    """
    Fonction personnalisée pour fusionner deux objets statistiques.
    """
    if stats1 is None:
        return stats2
    if stats2 is None:
        return stats1
    
    result = {
        "total": stats1["total"] + stats2["total"],
        "gender_counts": {},
        "nationality_counts": {},
        "scholarship_count": stats1["scholarship_count"] + stats2["scholarship_count"],
        "graduated_count": stats1["graduated_count"] + stats2["graduated_count"],
        "mark_sum": stats1["mark_sum"] + stats2["mark_sum"],
        "mark_count": stats1["mark_count"] + stats2["mark_count"]
    }
    
    # Fusionner les comptes par genre
    for gender, count in stats1["gender_counts"].items():
        result["gender_counts"][gender] = count
    for gender, count in stats2["gender_counts"].items():
        if gender in result["gender_counts"]:
            result["gender_counts"][gender] += count
        else:
            result["gender_counts"][gender] = count
    
    # Fusionner les comptes par nationalité
    for nat, count in stats1["nationality_counts"].items():
        result["nationality_counts"][nat] = count
    for nat, count in stats2["nationality_counts"].items():
        if nat in result["nationality_counts"]:
            result["nationality_counts"][nat] += count
        else:
            result["nationality_counts"][nat] = count
    
    return result

# Exemple d'utilisation

def main():
    """
    Exemple d'utilisation de DataChunker.
    """
    # Chemin vers le fichier CSV (à adapter à votre environnement)
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    csv_file = os.path.join(data_dir, 'students.csv')
    
    if not os.path.exists(csv_file):
        logger.error(f"Fichier non trouvé: {csv_file}")
        return
    
    # Exemple 1: Compter les étudiants par genre
    with DataChunker(csv_file, chunk_size=1000) as chunker:
        gender_counts = chunker.process_file(count_by_attribute, 'Gender')
        
        if gender_counts:
            print("\n=== Distribution par genre ===")
            for gender, count in gender_counts.items():
                print(f"{gender}: {count}")
    
    # Exemple 2: Calculer des statistiques
    with DataChunker(csv_file, chunk_size=1000) as chunker:
        statistics = chunker.process_file(calculate_statistics, merge_func=merge_statistics)
        
        if statistics:
            print("\n=== Statistiques générales ===")
            print(f"Total d'étudiants: {statistics['total']}")
            print(f"Nombre de boursiers: {statistics['scholarship_count']} " +
                 f"({statistics['scholarship_count']/statistics['total']*100:.1f}%)")
            print(f"Nombre de diplômés: {statistics['graduated_count']} " +
                 f"({statistics['graduated_count']/statistics['total']*100:.1f}%)")
            
            if statistics['mark_count'] > 0:
                avg_mark = statistics['mark_sum'] / statistics['mark_count']
                print(f"Note moyenne: {avg_mark:.2f}/20")
            
            print("\nTop nationalités:")
            sorted_nationalities = sorted(statistics['nationality_counts'].items(), 
                                         key=lambda x: x[1], reverse=True)
            for nat, count in sorted_nationalities[:5]:
                print(f"{nat}: {count} ({count/statistics['total']*100:.1f}%)")
    
    # Exemple 3: Traitement avec limitation du nombre de lignes
    with DataChunker(csv_file, chunk_size=1000, max_rows=5000) as chunker:
        result = chunker.process_file(count_by_attribute, 'School')
        
        if result:
            print("\n=== Distribution par école (sur 5000 premiers étudiants) ===")
            sorted_schools = sorted(result.items(), key=lambda x: x[1], reverse=True)
            for school, count in sorted_schools:
                print(f"{school}: {count}")

if __name__ == "__main__":
    main()
