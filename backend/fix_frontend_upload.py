import os
import json
import shutil
import socket
from http.server import HTTPServer, BaseHTTPRequestHandler
import cgi
import tempfile

class UploadHandler(BaseHTTPRequestHandler):
    def _set_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
    
    def do_OPTIONS(self):
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()
    
    def do_GET(self):
        if self.path == '/api/test':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self._set_cors_headers()
            self.end_headers()
            response = {"status": "API is working!"}
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self._set_cors_headers()
            self.end_headers()
            response = {"error": "Endpoint not found"}
            self.wfile.write(json.dumps(response).encode())
    
    def do_POST(self):
        if self.path == '/api/upload':
            try:
                content_type, params = cgi.parse_header(self.headers.get('Content-Type'))
                
                if content_type == 'multipart/form-data':
                    form = cgi.FieldStorage(
                        fp=self.rfile,
                        headers=self.headers,
                        environ={'REQUEST_METHOD': 'POST',
                                'CONTENT_TYPE': self.headers['Content-Type']}
                    )
                    
                    if 'file' in form:
                        fileitem = form['file']
                        if fileitem.file:
                            # Create a temporary file to save the uploaded content
                            with tempfile.NamedTemporaryFile(delete=False, suffix='.csv') as tmp:
                                tmp_path = tmp.name
                                fileitem.file.seek(0)
                                shutil.copyfileobj(fileitem.file, tmp)
                            
                            # Save to sample_data directory
                            target_dir = os.path.join(os.path.dirname(__file__), 'sample_data')
                            if not os.path.exists(target_dir):
                                os.makedirs(target_dir)
                            
                            target_path = os.path.join(target_dir, 'euromed_students_clean.csv')
                            shutil.copy(tmp_path, target_path)
                            
                            # Clean up temporary file
                            os.unlink(tmp_path)
                            
                            self.send_response(200)
                            self.send_header('Content-type', 'application/json')
                            self._set_cors_headers()
                            self.end_headers()
                            response = {
                                "success": True,
                                "message": "File uploaded successfully",
                                "path": target_path
                            }
                            self.wfile.write(json.dumps(response).encode())
                        else:
                            self.send_response(400)
                            self.send_header('Content-type', 'application/json')
                            self._set_cors_headers()
                            self.end_headers()
                            response = {"success": False, "error": "No file content"}
                            self.wfile.write(json.dumps(response).encode())
                    else:
                        self.send_response(400)
                        self.send_header('Content-type', 'application/json')
                        self._set_cors_headers()
                        self.end_headers()
                        response = {"success": False, "error": "No file field found"}
                        self.wfile.write(json.dumps(response).encode())
                else:
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self._set_cors_headers()
                    self.end_headers()
                    response = {"success": False, "error": "Content must be multipart/form-data"}
                    self.wfile.write(json.dumps(response).encode())
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self._set_cors_headers()
                self.end_headers()
                response = {"success": False, "error": str(e)}
                self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self._set_cors_headers()
            self.end_headers()
            response = {"error": "Endpoint not found"}
            self.wfile.write(json.dumps(response).encode())

def is_port_available(port):
    """Check if a port is available"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(('', port))
            return True
        except OSError:
            return False

def find_available_port(start_port=5000, max_attempts=20):
    """Find an available port starting from start_port"""
    port = start_port
    for _ in range(max_attempts):
        if is_port_available(port):
            return port
        port += 1
    raise RuntimeError(f"Could not find an available port after {max_attempts} attempts")

def run_server(port=8888):
    try:
        # Try the specified port first
        if not is_port_available(port):
            print(f"Port {port} is already in use. Looking for an available port...")
            port = find_available_port(port + 1)
        
        server_address = ('', port)
        httpd = HTTPServer(server_address, UploadHandler)
        print(f"Starting upload server on port {port}...")
        print(f"Test API at: http://localhost:{port}/api/test")
        print(f"Upload files to: http://localhost:{port}/api/upload")
        print("Press Ctrl+C to stop the server")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")
            httpd.server_close()
    except Exception as e:
        print(f"Error starting server: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    import sys
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8888
    run_server(port)
