#!/bin/bash
# generate-certificate.sh

# чистим папку, где могут находиться старые сертификаты
rm -rf /etc/letsencrypt/live/certfolder*

# выдаем себе сертификат (обратите внимание на переменные среды)
certbot certonly --standalone --email $EMAIL  -d $DOMAIN --cert-name=certfolder --key-type rsa --agree-tos

# удаляем старые сертификаты из примонтированной папки Nginx
rm -rf /app/ssl/cert.pem
rm -rf /app/ssl/key.pem

# копируем сертификаты в папку Nginx
cp /etc/letsencrypt/live/certfolder*/fullchain.pem /app/ssl/cert.pem
cp /etc/letsencrypt/live/certfolder*/privkey.pem /app/ssl/key.pem