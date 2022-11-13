# Part One: Solidify Terminology
In your own terms, define the following terms:

## What is HTTP?
HTTP is a way of communicating over the internet to request and send data.

## What is a URL?
A URL is an identifier or path that specifies where content is found.

## What is DNS?
DNS is a service which turns a website name into an IP address.

## What is a query string?
The query string is appended to the end of a URL and adds arguments and values that the server can use.

## What are two HTTP verbs and how are they different?
GET - requests a specific resource, without making serverside changes
HEAD - requests a specific resource but without the actual content. i.e. just the Header information

## What is an HTTP request?
A request to the server from a client to provide the specified content.

## What is an HTTP response?
The response sent from the server to the client based on the request received.

## What is an HTTP header? Give a couple examples of request and response headers you have seen.
The header contains meta data about the request or response.

### Examples
* Accept: text/html
* Accept: image/png
* Accept-Language: en-US

## What are the processes that happen when you type “http://somesite.com/some/page.html” into a browser?
1. Parse which protocol to use, e.g. http
2. Look up the site IP in DNS, first in the cache then to the router, isp and global DNS
3. Send a request to the server at the IP passing the requested resource
4. Receive the resource and parse the response
5. Display the page.
