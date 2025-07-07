import os
import sys
import subprocess

def setup_data_directory():
    """Vérifie et configure le répertoire de données"""
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
        print(f"Dossier de données créé: {data_dir}")
    
    # Vérifier si le fichier de données existe
    data_file = os.path.join(data_dir, 'students.csv')
    if not os.path.exists(data_file):
        # Chercher une source alternative
        sample_file = os.path.join(os.path.dirname(__file__), 'sample_data', 'euromed_students_clean.csv')
        if os.path.exists(sample_file):
            # Copier le fichier d'exemple
            import shutil
            shutil.copy(sample_file, data_file)
            print(f"Fichier de données d'exemple copié vers: {data_file}")
            return True
        else:
            print(f"AVERTISSEMENT: Aucun fichier de données trouvé ou créé.")
            return False
    
    return True

def try_fix_dependencies():
    """Essayer de corriger les problèmes de compatibilité entre NumPy et Pandas"""
    print("Tentative de résolution des problèmes de dépendances...")
    
    try:
        # Désinstaller numpy et pandas
        subprocess.check_call([sys.executable, "-m", "pip", "uninstall", "-y", "numpy", "pandas"])
        # Réinstaller numpy d'abord avec une version compatible
        subprocess.check_call([sys.executable, "-m", "pip", "install", "numpy==1.21.2"])
        # Puis installer pandas qui devrait être compatible avec numpy
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pandas==1.3.3"])
        # Installer les autres dépendances
        subprocess.check_call([sys.executable, "-m", "pip", "install", "flask==2.0.1", "flask-cors==3.0.10", "scikit-learn==1.0.2"])
        
        print("Dépendances réinstallées avec succès!")
        return True
    except Exception as e:
        print(f"Échec de la résolution des dépendances: {e}")
        return False

def check_dependencies():
    """Vérifie si les dépendances requises sont installées"""
    try:
        # Essayer d'importer les packages requis
        import numpy
        import pandas
        import flask
        import flask_cors
        
        try:
            import sklearn
        except ImportError:
            print("scikit-learn n'est pas installé. Installation en cours...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", "scikit-learn>=1.0.2"])
        
        # Tout est OK
        return True
        
    except ValueError as e:
        # C'est probablement une erreur de compatibilité NumPy/Pandas comme celle vue
        if "numpy.dtype size changed" in str(e):
            print("Problème de compatibilité entre NumPy et Pandas détecté. Tentative de correction...")
            return try_fix_dependencies()
        else:
            print(f"Erreur inattendue: {e}")
            return False
            
    except ImportError as e:
        print(f"Dépendance manquante: {e}")
        print("Tentative d'installation des dépendances requises...")
        return try_fix_dependencies()

def run_with_full_dependencies():
    """Exécute l'application avec toutes les dépendances"""
    # Configurer le répertoire de données
    if not setup_data_directory():
        print("Attention: Configuration du répertoire de données incomplète")
    
    # Importer et démarrer l'application Flask
    try:
        import importlib
        spec = importlib.util.find_spec('services.data_service')
        if spec is None:
            print("Le module services.data_service n'existe pas.")
            print("Veuillez vous assurer que le dossier services et ses modules sont bien créés.")
            return False
            
        from app import app
        
        try:
            # Vérifier que les services sont bien initialisés
            from services.data_service import data_service
            if data_service.df is None:
                print("Erreur: Les données n'ont pas été chargées correctement")
                return False
            
            print(f"Données chargées avec succès: {len(data_service.df)} étudiants")
        except Exception as e:
            print(f"Erreur lors du chargement des données: {e}")
            return False
        
        # Démarrer le serveur Flask
        print("\nDémarrage du serveur Flask...")
        app.run(debug=True)
        
        return True
    except Exception as e:
        print(f"Erreur lors du démarrage de l'application: {e}")
        import traceback
        traceback.print_exc()
        return False

def run_with_no_dependencies():
    """Exécute l'application sans dépendances externes"""
    print("\nPassage au mode sans dépendances externes...")
    
    try:
        # Exécuter le script run_no_deps.py
        script_path = os.path.join(os.path.dirname(__file__), 'run_no_deps.py')
        if os.path.exists(script_path):
            subprocess.call([sys.executable, script_path])
            return True
        else:
            print(f"ERREUR: Le script {script_path} n'existe pas.")
            return False
    except Exception as e:
        print(f"Erreur lors de l'exécution du mode sans dépendances: {e}")
        return False

def main():
    """Fonction principale"""
    print("=== Démarrage de l'application Euromed Analytics (version améliorée) ===")
    
    # Vérifier les dépendances
    dependencies_ok = check_dependencies()
    
    # Si les dépendances sont OK, utiliser la version complète
    if dependencies_ok:
        print("Démarrage avec toutes les fonctionnalités...")
        if run_with_full_dependencies():
            return True
    
    # Sinon, utiliser la version sans dépendances
    print("La version complète a échoué ou les dépendances sont manquantes.")
    return run_with_no_dependencies()

if __name__ == "__main__":
    success = main()
    if not success:
        print("\n=== Instructions pour résoudre les problèmes ===")
        print("1. Essayez de réinstaller manuellement les dépendances:")
        print("   pip uninstall -y numpy pandas")
        print("   pip install numpy==1.21.2")
        print("   pip install pandas==1.3.3")
        print("   pip install flask==2.0.1 flask-cors==3.0.10 scikit-learn==1.0.2")
        print("2. Assurez-vous que le fichier de données CSV existe dans le dossier data/")
        print("3. Si le problème persiste, utilisez le mode sans dépendances: python run_no_deps.py")
        sys.exit(1)
