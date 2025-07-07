import os
import sys
import shutil

def ensure_data_directory():
    """S'assure que le dossier data existe et contient le fichier students.csv"""
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
        print(f"Dossier data créé: {data_dir}")
    
    # Vérifier si le fichier existe déjà dans data
    target_file = os.path.join(data_dir, 'students.csv')
    if not os.path.exists(target_file):
        # Chercher dans sample_data
        sample_file = os.path.join(os.path.dirname(__file__), 'sample_data', 'euromed_students_clean.csv')
        if os.path.exists(sample_file):
            shutil.copy(sample_file, target_file)
            print(f"Fichier de données copié de {sample_file} vers {target_file}")
        else:
            print("AVERTISSEMENT: Fichier source introuvable. L'application pourrait ne pas fonctionner correctement.")

def main():
    """Fonction principale pour démarrer l'application"""
    print("=== Démarrage de l'application Euromed Analytics ===")
    
    # S'assurer que le répertoire de données existe
    ensure_data_directory()
    
    # Importer et lancer l'application Flask
    try:
        from app import app
        print("Démarrage du serveur Flask...")
        app.run(debug=True)
    except Exception as e:
        print(f"ERREUR lors du démarrage de l'application: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    if not success:
        print("\n=== Instructions pour résoudre les problèmes ===")
        print("1. Vérifiez que tous les fichiers nécessaires sont présents")
        print("2. Vérifiez que toutes les dépendances sont installées: pip install -r requirements.txt")
        print("3. Si le problème persiste, consultez la documentation ou contactez l'équipe de développement")
        sys.exit(1)
