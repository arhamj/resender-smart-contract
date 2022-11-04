FROM locustio/locust:1.3.1
ADD locustfile.py /home/locust/

ENTRYPOINT ["locust", "-f"]
CMD ["./locustfile.py"] 
