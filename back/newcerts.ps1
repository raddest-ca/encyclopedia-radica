# https://stackoverflow.com/a/49784278/11141271
openssl req `
    -x509 `
    -nodes `
    -days "365" `
    -newkey "rsa:2048" `
    -keyout "static/cert.key" `
    -out "static/cert.pem" `
    -config "req.cnf" `
    -sha256