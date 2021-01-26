sudo systemctl start docker
SPANDX_CONFIG="profiles/local-frontends.js" bash ../insights-proxy/scripts/run.sh
