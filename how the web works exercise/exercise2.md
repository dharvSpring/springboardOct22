# Part Two: Practice Tools
## Using curl, make a GET request to the icanhazdadjoke.com API to find all jokes involving the word “pirate”
```curl https://icanhazdadjoke.com/search?term=pirate```

* What did the pirate say on his 80th birthday? Aye Matey!
* Why couldn't the kid see the pirate movie? Because it was rated arrr!
* What does a pirate pay for his corn? A buccaneer!
* Why are pirates called pirates? Because they arrr!
* Why do pirates not know the alphabet? They always get stuck at "C".

## Use dig to find what the IP address is for icanhazdadjoke.com
```dig https://icanhazdadjoke.com```

172.23.176.1

## Make a simple web page and serve it using python3 -m http.server. Visit the page in a browser.

```
david@David-PC:~$ mkdir simplehttp
david@David-PC:~$ cd simplehttp/
david@David-PC:~/simplehttp$ touch index.html
david@David-PC:~/simplehttp$ vi index.html
david@David-PC:~/simplehttp$ python3 -m http.server
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
127.0.0.1 - - [12/Nov/2022 19:22:41] "GET / HTTP/1.1" 200 -
127.0.0.1 - - [12/Nov/2022 19:22:41] code 404, message File not found
127.0.0.1 - - [12/Nov/2022 19:22:41] "GET /favicon.ico HTTP/1.1" 404 -
```