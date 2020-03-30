FROM nginx:alpine
LABEL author="dedo-devops"
COPY ./www /var/www
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"] 
