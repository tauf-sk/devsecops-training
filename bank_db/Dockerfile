FROM mysql:8.0

ENV MYSQL_ROOT_PASSWORD='Nss$awh$node'
ENV MYSQL_DATABASE=banking

COPY ./sqlfile.sql /docker-entrypoint-initdb.d/sqlfile.sql
COPY my.cnf /etc/mysql/conf.d/my.cnf
