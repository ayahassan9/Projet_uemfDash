import importlib.util
import subprocess
import sys
import os

def check_package(package_name):
    """Vérifie si un package est installé"""
    return importlib.util.find_spec(package_name) is not None

def install_package(package_name):
    """Installe un package avec pip"""
    print(f"Installation de {package_name}...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package_name, "--no-build-isolation"])
        return True
    except subprocess.CalledProcessError:
        print(f"Impossible d'installer {package_name}")
        return False

# Liste des packages requis
required_packages = ["numpy", "flask", "flask_cors", "pandas"]

# Vérifier et installer les packages manquants
for package in required_packages:
    if not check_package(package):
        success = install_package(package)
        if not success:
            print(f"Erreur: Impossible d'installer {package}. L'application ne peut pas démarrer.")
            sys.exit(1)

# Une fois toutes les dépendances installées, lancer l'application
try:
    from simple_load import load_simple_data
    
    # Charger les données
    print("Chargement des données...")
    df = load_simple_data()
    
    if df is not None:
        print(f"Données chargées avec succès: {len(df)} étudiants")
        
        # Lancer l'application Flask
        print("Démarrage du serveur Flask...")
        from app import app
        app.run(debug=True)
    else:
        print("Erreur: Impossible de charger les données.")
        sys.exit(1)
        
except Exception as e:
    print(f"Erreur lors du démarrage de l'application: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
