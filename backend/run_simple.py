#!/usr/bin/env python3
"""
Script simple pour démarrer Euromed Analytics sans dépendances problématiques.
Ce script contourne les problèmes de compatibilité NumPy/Pandas.
"""
import os
import sys

def main():
    print("=== Démarrage de l'application Euromed Analytics (mode simple) ===")
    
    # Vérifier si le fichier run_no_deps.py existe
    script_path = os.path.join(os.path.dirname(__file__), 'run_no_deps.py')
    if not os.path.exists(script_path):
        print(f"ERREUR: Le fichier {script_path} n'existe pas!")
        return False
    
    # Exécuter le script
    try:
        import runpy
        runpy.run_path(script_path)
        return True
    except Exception as e:
        print(f"Erreur lors de l'exécution de run_no_deps.py: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)
