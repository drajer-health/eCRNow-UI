import {http} from http;
import {mockserver} from "mockserver";

http.createServer(mockserver('./response.json')).listen(9001);
