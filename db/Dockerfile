FROM library/postgres:9.4

ENV POSTGRES_USER ophelia
ENV POSTGRES_PASSWORD ophelia
ENV POSTGRES_DB ophelia

ADD init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
