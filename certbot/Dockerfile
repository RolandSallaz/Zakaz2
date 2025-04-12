FROM ubuntu:22.04

EXPOSE 6000 80

# Устанавливаем необходимые пакеты
RUN apt-get update && apt-get install -y certbot cron nginx

# Копируем файл cron из вашей папки certbot в контейнер
COPY certbot/certbot-renew.cron /etc/cron.d/certbot-renew

# Устанавливаем права для cron файла
RUN chmod 0644 /etc/cron.d/certbot-renew

# Запускаем cron
CMD ["cron", "-f"]