FROM ubuntu:22.04

EXPOSE 6000 80

RUN apt-get update && apt-get install -y certbot cron nginx

# Копируем файл cron из текущей директории в контейнер
COPY certbot-renew.cron /etc/cron.d/certbot-renew

# Устанавливаем права для cron файла
RUN chmod 0644 /etc/cron.d/certbot-renew

# Запускаем cron
CMD ["cron", "-f"]