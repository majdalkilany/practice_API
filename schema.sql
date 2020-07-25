DROP TABLE IF EXISTS movie ;
CREATE TABLE movie(
    id SERIAL PRIMARY KEY ,
    title VARCHAR (250),
    image_url VARCHAR (255),
    overview TEXT 


)