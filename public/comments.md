For running locally I decided to use firebase instead of node since we will be storing data anyway. Right now I can deploy it there as well. To run locally we need to make sure it's at port 8080. This is because of CORS. I had to assign a "safe" server and I used http://localhost:8080/ as the safe server. To run locally and bipass default port, from command type:
firebase serve -p 8080 -o 127.0.0.1


I have uploaded the test.html file so you will have to navigate there. 