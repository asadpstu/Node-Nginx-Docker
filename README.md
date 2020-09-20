sudo docker images
sudo docker build -t app-name .
sudo docker run -d -p 8000:3000 app-name //detach mode
sudo docker run -it -p 8000:3000 app-name
sudo docker ps

#docker compose
sudo docker-compose build --force-rm --no-cache --pull
sudo docker-compose up


sudo docker ps
sudo docker exec -it 1637907917d3 sh 
exit

#To see all process with id
ps -aux |grep 6379

Public Key:
BGSCTOuz0fZs_oKrqhm9296pFbYKbZHQ87eJSzNVE_M-czHgrRuhMyEjYfnmY1h69ELjUJIiSOc4nkjK4f8yF7U

Private Key:
f4zajkLiapx5n2_2H67lukCpsY26002Uz_ZrelImrmc



//Aws
First command : sudo aws ecr get-login
Second command : Response of First command with sudo

//docker images delete
sudo docker rmi 84c5f6e03bf0

 sudo docker image prune
 sudo docker image prune -a
 sudo docker system prune


