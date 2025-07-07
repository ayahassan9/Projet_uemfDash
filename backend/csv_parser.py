import csv
import json
import os
import gc  # Garbage collector pour libérer la mémoire
import logging

# Configurer les logs
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def parse_csv(file_path, max_rows=None, chunk_size=10000):
    """
    Simple CSV parser that doesn't require pandas - optimized for large files
    
    Args:
        file_path: Path to the CSV file
        max_rows: Maximum number of rows to process (None for all)
        chunk_size: Process the file in chunks of this size
        
    Returns:
        A dictionary with data and column information
    """
    if not os.path.exists(file_path):
        logger.error(f"Erreur: Le fichier {file_path} n'existe pas.")
        return None
    
    try:
        # Get file size for progress reporting
        file_size = os.path.getsize(file_path)
        logger.info(f"Taille du fichier: {file_size/1024/1024:.2f} MB")
        
        # First pass: count lines and check if there are comment lines
        with open(file_path, 'r', encoding='utf-8') as f:
            # Read first few lines to check for comments
            first_lines = []
            for _ in range(10):  # Check first 10 lines
                try:
                    line = next(f)
                    first_lines.append(line)
                except StopIteration:
                    break
        
        # Check if we need to remove comments
        has_comments = any(line.strip().startswith('//') for line in first_lines)
        
        # Create a temporary file without comments if needed
        if has_comments:
            logger.info("Détection de commentaires, création d'un fichier temporaire...")
            temp_path = file_path + ".temp"
            with open(file_path, 'r', encoding='utf-8') as infile:
                with open(temp_path, 'w', encoding='utf-8') as outfile:
                    for line in infile:
                        if not line.strip().startswith('//'):
                            outfile.write(line)
            file_path = temp_path
            logger.info(f"Fichier temporaire créé: {temp_path}")
        
        # Now process the file in chunks
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            headers = next(reader)
            
            data = []
            row_count = 0
            chunk_count = 0
            
            logger.info("Début du traitement des données par chunks...")
            
            while True:
                chunk = []
                for _ in range(chunk_size):
                    try:
                        row = next(reader)
                        row_count += 1
                        
                        if max_rows and row_count > max_rows:
                            break
                            
                        if len(row) != len(headers):
                            logger.warning(f"Ligne {row_count}: nombre de colonnes incorrect (ignorée)")
                            continue
                        
                        # Process the row
                        record = {}
                        for i, header in enumerate(headers):
                            value = row[i].strip() if i < len(row) else ""
                            
                            # Convert boolean values
                            if value.lower() == 'true':
                                value = True
                            elif value.lower() == 'false':
                                value = False
                            
                            # Try to parse JSON in semester columns
                            elif header.startswith('S') and header[1:].isdigit() and value:
                                try:
                                    value = json.loads(value)
                                except json.JSONDecodeError:
                                    logger.warning(f"JSON invalide dans la colonne {header}: {value}")
                            
                            record[header] = value
                        
                        chunk.append(record)
                        
                    except StopIteration:
                        break
                
                # Add current chunk to data
                if chunk:
                    data.extend(chunk)
                    chunk_count += 1
                    logger.info(f"Chunk {chunk_count} traité: {len(chunk)} lignes (total: {row_count})")
                else:
                    # No more data
                    break
                
                # Force garbage collection to free memory
                chunk = None
                gc.collect()
                
                if max_rows and row_count >= max_rows:
                    logger.info(f"Limite de {max_rows} lignes atteinte")
                    break
            
            # Clean up temporary file
            if has_comments and file_path.endswith('.temp'):
                try:
                    os.remove(file_path)
                    logger.info("Fichier temporaire supprimé.")
                except:
                    logger.warning("Impossible de supprimer le fichier temporaire.")
            
            result = {
                "columns": headers,
                "data": data,
                "count": len(data)
            }
            
            logger.info(f"Données chargées avec succès: {len(data)} étudiants")
            return result
            
    except Exception as e:
        logger.error(f"Erreur lors du chargement des données: {e}")
        import traceback
        traceback.print_exc()
        return None

def get_statistics(data):
    """
    Generate basic statistics from the parsed data
    """
    if not data or "data" not in data or not data["data"]:
        return None
    
    # Count occurrences for categorical columns
    gender_counts = {}
    nationality_counts = {}
    school_counts = {}
    bac_type_counts = {}
    
    # Count boolean columns
    scholarship_count = 0
    graduated_count = 0
    
    for record in data["data"]:
        # Gender counts
        gender = record.get("Gender", "Unknown")
        gender_counts[gender] = gender_counts.get(gender, 0) + 1
        
        # Nationality counts
        nationality = record.get("Nationality", "Unknown")
        nationality_counts[nationality] = nationality_counts.get(nationality, 0) + 1
        
        # School counts
        school = record.get("School", "Unknown")
        school_counts[school] = school_counts.get(school, 0) + 1
        
        # Bac type counts
        bac_type = record.get("Baccalaureat_Type", "Unknown")
        bac_type_counts[bac_type] = bac_type_counts.get(bac_type, 0) + 1
        
        # Scholarship count
        if record.get("Scholarship") is True:
            scholarship_count += 1
        
        # Graduated count
        if record.get("Graduated") is True:
            graduated_count += 1
    
    stats = {
        "total_students": len(data["data"]),
        "gender_distribution": gender_counts,
        "nationalities": nationality_counts,
        "schools": school_counts,
        "bac_types": bac_type_counts,
        "scholarship_percentage": (scholarship_count / len(data["data"])) * 100 if data["data"] else 0,
        "graduation_rate": (graduated_count / len(data["data"])) * 100 if data["data"] else 0
    }
    
    return stats

if __name__ == "__main__":
    import sys
    
    # Use the provided file path or default to sample data
    file_path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
        os.path.dirname(__file__), 'sample_data', 'euromed_students.csv'
    )
    
    logger.info(f"Chargement des données depuis: {file_path}")
    data = parse_csv(file_path)
    
    if data:
        logger.info("\n=== Aperçu des données ===")
        for i, record in enumerate(data["data"][:5]):
            logger.info(f"Record {i+1}: {record}")
            
        stats = get_statistics(data)
        logger.info("\n=== Statistiques des données ===")
        logger.info(f"Nombre total d'étudiants: {stats['total_students']}")
        logger.info(f"Distribution par genre: {stats['gender_distribution']}")
        logger.info(f"Nationalités: {stats['nationalities']}")
        logger.info(f"Types de baccalauréat: {stats['bac_types']}")
        logger.info(f"Pourcentage d'étudiants boursiers: {stats['scholarship_percentage']:.2f}%")
        logger.info(f"Taux de diplomation: {stats['graduation_rate']:.2f}%")
