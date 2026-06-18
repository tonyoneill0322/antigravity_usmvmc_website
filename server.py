import socket
import http.server
import socketserver

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    """Simple threaded HTTP server supporting IPv6 and IPv4 dual stack."""
    address_family = socket.AF_INET6
    daemon_threads = True

if __name__ == '__main__':
    handler = NoCacheHTTPRequestHandler
    # Bind to empty string and port 8089.
    # AF_INET6 with empty string binds to all interfaces for both IPv4 and IPv6.
    server_address = ('', 8089)
    httpd = ThreadedHTTPServer(server_address, handler)
    print("Serving HTTP on port 8089 (supporting IPv4 and IPv6)...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        httpd.server_close()
