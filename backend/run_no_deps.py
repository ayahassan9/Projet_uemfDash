import os
import sys
import http.server
import socketserver
import json
import cgi
from urllib.parse import urlparse, parse_qs
import tempfile
import shutil

# Global variables for data sharing with the handler
csv_data = None
stats = None

class EuromedHandler(http.server.SimpleHTTPRequestHandler):
    def _set_headers(self, content_type='application/json'):
        self.send_response(200)
        self.send_header('Content-Type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')  # CORS
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_OPTIONS(self):
        self._set_headers()
    
    def do_POST(self):
        global csv_data
        global stats
        
        if self.path == '/api/upload':
            try:
                content_type, params = cgi.parse_header(self.headers.get('Content-Type'))
                
                if content_type == 'multipart/form-data':
                    form = cgi.FieldStorage(
                        fp=self.rfile,
                        headers=self.headers,
                        environ={'REQUEST_METHOD': 'POST',
                                'CONTENT_TYPE': self.headers['Content-Type'],
                                'CONTENT_LENGTH': self.headers['Content-Length']}
                    )
                    
                    if 'file' in form:
                        fileitem = form['file']
                        if fileitem.file:
                            # Create a temporary file to save the uploaded content
                            with tempfile.NamedTemporaryFile(delete=False, suffix='.csv') as tmp:
                                tmp_path = tmp.name
                                fileitem.file.seek(0)
                                shutil.copyfileobj(fileitem.file, tmp)
                            
                            # Process the uploaded file
                            from csv_parser import parse_csv, get_statistics
                            new_data = parse_csv(tmp_path)
                            
                            if new_data:
                                # Update global data
                                csv_data = new_data
                                stats = get_statistics(new_data)
                                
                                # Send success response
                                self._set_headers()
                                response = {
                                    "success": True,
                                    "message": f"File uploaded successfully. {new_data['count']} records processed.",
                                    "summary": {
                                        "row_count": new_data["count"],
                                        "column_count": len(new_data["columns"]),
                                        "columns": new_data["columns"]
                                    }
                                }
                                self.wfile.write(json.dumps(response).encode())
                            else:
                                # Send error response
                                self.send_response(400)
                                self._set_headers()
                                response = {"success": False, "error": "Failed to process the uploaded file."}
                                self.wfile.write(json.dumps(response).encode())
                            
                            # Clean up temporary file
                            if os.path.exists(tmp_path):
                                os.unlink(tmp_path)
                        else:
                            self.send_response(400)
                            self._set_headers()
                            response = {"success": False, "error": "No file content received."}
                            self.wfile.write(json.dumps(response).encode())
                    else:
                        self.send_response(400)
                        self._set_headers()
                        response = {"success": False, "error": "No file field in form."}
                        self.wfile.write(json.dumps(response).encode())
                else:
                    self.send_response(415)
                    self._set_headers()
                    response = {"success": False, "error": "Content-Type must be multipart/form-data."}
                    self.wfile.write(json.dumps(response).encode())
            except Exception as e:
                self.send_response(500)
                self._set_headers()
                response = {"success": False, "error": str(e)}
                self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self._set_headers()
            response = {"success": False, "error": "Endpoint not found."}
            self.wfile.write(json.dumps(response).encode())
        
    def do_GET(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        # Route pour les statistiques de base
        if path == '/api/data/summary':
            self._set_headers()
            summary = {
                "row_count": csv_data["count"],
                "column_count": len(csv_data["columns"]),
                "columns": csv_data["columns"]
            }
            self.wfile.write(json.dumps(summary).encode())
            
        # Route pour les statistiques par genre
        elif path == '/api/statistics/gender':
            self._set_headers()
            gender_stats = {
                "counts": stats["gender_distribution"],
                "total": stats["total_students"]
            }
            self.wfile.write(json.dumps(gender_stats).encode())
            
        # Route pour les statistiques de nationalité
        elif path == '/api/statistics/nationality':
            self._set_headers()
            nationality_stats = {
                "counts": stats["nationalities"],
                "total": stats["total_students"]
            }
            self.wfile.write(json.dumps(nationality_stats).encode())
            
        # Servir les fichiers statiques pour tout autre chemin
        else:
            # Rediriger vers index.html
            self._set_headers('text/html')
            html_content = """
            <!DOCTYPE html>
            <html>
            <head>
                <title>Euromed Analytics API</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
                    h1 { color: #1976d2; }
                    h2 { color: #424242; }
                    pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
                    .endpoint { margin-bottom: 20px; }
                </style>
            </head>
            <body>
                <h1>Euromed Analytics API</h1>
                <p>API simple pour accéder aux données d'étudiants d'Euromed Fès.</p>
                
                <h2>Points d'accès disponibles:</h2>
                
                <div class="endpoint">
                    <h3>GET /api/data/summary</h3>
                    <p>Récupère un résumé des données chargées.</p>
                    <pre>curl -X GET http://localhost:8000/api/data/summary</pre>
                </div>
                
                <div class="endpoint">
                    <h3>GET /api/statistics/gender</h3>
                    <p>Récupère les statistiques de distribution par genre.</p>
                    <pre>curl -X GET http://localhost:8000/api/statistics/gender</pre>
                </div>
                
                <div class="endpoint">
                    <h3>GET /api/statistics/nationality</h3>
                    <p>Récupère les statistiques de distribution par nationalité.</p>
                    <pre>curl -X GET http://localhost:8000/api/statistics/nationality</pre>
                </div>
            </body>
            </html>
            """
            self.wfile.write(html_content.encode('utf-8'))

def main():
    print("=== Démarrage de l'application Euromed Analytics sans dépendances externes ===")
    
    # Make our globals accessible
    global csv_data
    global stats
    
    # Vérifier si le dossier sample_data existe, sinon le créer
    sample_data_dir = os.path.join(os.path.dirname(__file__), 'sample_data')
    if not os.path.exists(sample_data_dir):
        os.makedirs(sample_data_dir)
        print(f"Dossier créé: {sample_data_dir}")
    
    # Chemin vers le fichier CSV
    csv_path = os.path.join(sample_data_dir, 'euromed_students.csv')
    
    # Vérifier si le fichier CSV existe
    if not os.path.exists(csv_path):
        print(f"ERREUR: Le fichier {csv_path} n'existe pas!")
        print("Veuillez créer ce fichier en suivant les instructions.")
        return False
    
    # Charger les données avec notre parser CSV personnalisé
    print("Tentative de chargement des données...")
    try:
        from csv_parser import parse_csv, get_statistics
        csv_data = parse_csv(csv_path)
        
        if not csv_data:
            print("ERREUR: Impossible de charger les données!")
            return False
        
        print("Données chargées avec succès!")
        print(f"Nombre d'étudiants: {csv_data['count']}")
        
        # Get statistics
        stats = get_statistics(csv_data)
        
    except ImportError:
        print("ERREUR: Module csv_parser non trouvé!")
        return False
    except Exception as e:
        print(f"ERREUR lors du chargement des données: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # Créer une mini-application HTTP simple
    print("\nDémarrage du serveur HTTP simple...")
    try:
        # Configurer et démarrer le serveur
        PORT = 8000
        handler = EuromedHandler
        
        httpd = socketserver.TCPServer(("", PORT), handler)
        print(f"Serveur démarré sur le port {PORT}")
        print(f"Accédez à l'API via: http://localhost:{PORT}/api/data/summary")
        print("Appuyez sur Ctrl+C pour arrêter le serveur.")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nArrêt du serveur...")
            httpd.server_close()
            return True
            
    except Exception as e:
        print(f"ERREUR lors du démarrage du serveur HTTP: {e}")
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
        print("3. Si le problème persiste, contactez l'équipe de développement")
        sys.exit(1)
