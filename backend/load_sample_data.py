import pandas as pd
import json
import os
import sys

def load_sample_data(file_path=None):
    """
    Charge les données d'exemple et les prépare pour l'application
    """
    # Chemin vers le fichier de données (par défaut ou spécifié)
    if file_path is None:
        data_path = os.path.join(os.path.dirname(__file__), 'sample_data', 'euromed_students.csv')
    else:
        data_path = file_path
    
    if not os.path.exists(data_path):
        print(f"Erreur: Le fichier de données n'existe pas à {data_path}")
        print(f"Chemin absolu cherché: {os.path.abspath(data_path)}")
        print("Vérifiez que vous avez bien créé le dossier 'sample_data' et qu'il contient le fichier CSV")
        return None
    
    # Charger les données
    try:
        # Ouvrir d'abord le fichier pour vérifier s'il contient des commentaires
        with open(data_path, 'r', encoding='utf-8') as f:
            first_line = f.readline().strip()
            # Si la première ligne commence par '//', c'est un commentaire
            if first_line.startswith('//'):
                print("AVERTISSEMENT: Le fichier CSV commence par une ligne de commentaire. Tentative de nettoyage...")
                # Lire tout le fichier
                f.seek(0)
                content = f.readlines()
                # Filtrer les lignes qui ne commencent pas par '//'
                valid_content = [line for line in content if not line.strip().startswith('//')]
                
                # Écrire un fichier temporaire nettoyé
                temp_file = data_path + ".temp"
                with open(temp_file, 'w', encoding='utf-8') as temp:
                    temp.writelines(valid_content)
                
                print(f"Fichier temporaire nettoyé créé: {temp_file}")
                data_path = temp_file

        # Maintenant charger le fichier (original ou nettoyé)
        print(f"Tentative de lecture du fichier CSV: {data_path}")
        df = pd.read_csv(data_path)
        
        # Convertir les colonnes de semestres de JSON string en dictionnaires Python
        semester_cols = [col for col in df.columns if col.startswith('S') and col[1:].isdigit()]
        for col in semester_cols:
            df[col] = df[col].apply(lambda x: {} if pd.isna(x) else json.loads(x) if isinstance(x, str) else x)
        
        # Convertir les colonnes booléennes
        bool_cols = ['Scholarship', 'Graduated']
        for col in bool_cols:
            df[col] = df[col].astype(str).map({'True': True, 'False': False})
        
        print(f"Données chargées avec succès: {len(df)} étudiants")
        
        # Nettoyer le fichier temporaire si créé
        if data_path.endswith('.temp'):
            os.remove(data_path)
            print("Fichier temporaire nettoyé supprimé")
            
        return df
    
    except Exception as e:
        print(f"Erreur lors du chargement des données: {e}")
        import traceback
        traceback.print_exc()
        return None

def get_sample_statistics():
    """
    Génère les statistiques de base à partir des données d'exemple
    """
    df = load_sample_data()
    if df is None:
        return None
    
    stats = {
        "total_students": len(df),
        "gender_distribution": df['Gender'].value_counts().to_dict(),
        "nationalities": df['Nationality'].value_counts().to_dict(),
        "schools": df['School'].value_counts().to_dict(),
        "bac_types": df['Baccalaureat_Type'].value_counts().to_dict(),
        "scholarship_percentage": (df['Scholarship'].sum() / len(df)) * 100,
        "graduation_rate": (df[df['Graduated'] == True].shape[0] / len(df)) * 100
    }
    
    return stats

if __name__ == "__main__":
    # Si un chemin de fichier est fourni en argument
    file_path = sys.argv[1] if len(sys.argv) > 1 else None
    
    # Charger les données
    df = load_sample_data(file_path)
    
    if df is not None:
        # Afficher quelques informations sur les données
        print("\n=== Aperçu des données ===")
        print(df.head())
        
        print("\n=== Statistiques des données ===")
        stats = get_sample_statistics()
        print(f"Nombre total d'étudiants: {stats['total_students']}")
        print(f"Distribution par genre: {stats['gender_distribution']}")
        print(f"Nationalités: {stats['nationalities']}")
        print(f"Types de baccalauréat: {stats['bac_types']}")
        print(f"Pourcentage d'étudiants boursiers: {stats['scholarship_percentage']:.2f}%")
        print(f"Taux de diplomation: {stats['graduation_rate']:.2f}%")
