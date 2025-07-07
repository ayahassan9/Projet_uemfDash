import os
import sys
from simple_load import load_simple_data

def main():
    print("=== Démarrage de l'application Euromed Analytics ===")
    
    # Vérifier si le dossier sample_data existe, sinon le créer
    sample_data_dir = os.path.join(os.path.dirname(__file__), 'sample_data')
    if not os.path.exists(sample_data_dir):
        os.makedirs(sample_data_dir)
        print(f"Dossier créé: {sample_data_dir}")
    
    # Essayer de charger les données avec la méthode simplifiée
    print("Tentative de chargement des données...")
    df = load_simple_data()
    
    if df is None:
        print("ERREUR: Impossible de charger les données!")
        return False
    
    print("Données chargées avec succès!")
    print(f"Nombre d'étudiants: {len(df)}")
    
    # Lancer l'application Flask
    print("\nDémarrage du serveur Flask...")
    try:
        # On importe ici pour éviter une erreur si l'import ne fonctionne pas
        from app import app
        app.run(debug=True)
    except Exception as e:
        print(f"ERREUR lors du démarrage du serveur Flask: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    if not success:
        print("\n=== Instructions pour résoudre les problèmes ===")
        print("1. Vérifiez que le fichier CSV est correctement formaté")
        print("2. Assurez-vous que le fichier ne commence pas par des commentaires '// filepath:'")
        print("3. Vérifiez que toutes les dépendances sont installées: pip install -r requirements.txt")
        print("4. Si le problème persiste, contactez l'équipe de développement")
        sys.exit(1)
