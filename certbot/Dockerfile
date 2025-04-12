FROM ubuntu:22.04

EXPOSE 6000 80

WORKDIR /certbot
COPY . /certbot
WORKDIR /certbot

RUN apt-get update
RUN apt-get -y install certbot cron

# добавляем скрипт генерации сертификатов
RUN chmod +x generate-certificate.sh

# создаем cronjob для автообновления сертификатов
RUN echo "@monthly /certbot/generate-certificate.sh" >> /etc/crontab

# запускаем cron
CMD cron && tail -f /var/log/cron.log
