# News Aggregator
A website that pulls articles from various sources and displays them in a clean, easy-to-read format

# Setup
1- Clone the repository by running the command ```git clone https://github.com/RoohAllahKhan/news-aggregator.git```             
2- Go to the project directory and run ```docker-compose build```        
3- After docker finishes building run the following command ```docker-compose up```       
4- SSH the backend container by running the command ```docker exec -it "backend" sh```
5- Run the command ```chmod -R 777 storage```    
6- Run the command ```php artisan migrate``` to generate the database schema.   
6- Run the command ```php artisan db:seed``` to generate a User.    
    - Email: admin@innoscript.com  
    - Password: 12345678   
7- Run the command ```php artisan news:fetch``` to get news from integrated services.    
8: The backend of the project will be running on ```localhost:8000```  
9- To access frontend go to ```localhost:3000```.   
10: You can connect to the docker mysql instance by using any GUI software like WorkBench by using these details:   
    - HOST: localhost:3307  
    - USER: root    
    - PASSWORD:
