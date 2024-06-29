import 'dotenv/config';

import OpenAI from "openai";
import http from "http";
import url from "url"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const server = http.createServer();
server.listen(3000);

server.on("request", async (req, res) => {
    let parsedUrl = url.parse(req.url, true);
    let query = parsedUrl.query;
  
    switch (parsedUrl.pathname) {
    case "/server":
        let model = query.model;
        let messages = query.messages.map((message) => JSON.parse(message));

        console.log(model)

        const config = {
            model,
            stream: true,
            messages
        };

        try {
            console.log("request begun");

            const completion = await openai.chat.completions.create(config);

            req.on("close", () => {
                console.log("request closed")
                completion.controller.abort();
            });

            res.writeHead(200, {
                "Content-Type": "text/plain; charset=utf-8",
            });
    
            for await (const chunk of completion) {
                const [choice] = chunk.choices;
                const { content } = choice.delta;
                if (choice.finish_reason === "length") {
                    res.write("ERROR:token_limit_reached");
                } else if (content == undefined) {
                    //do nothing?
                    //is this some sort of error? or just a sign that the request is finished
                } else {
                    res.write(content);
                }
            }
        } catch (error) {
            res.end(error);
 //           if (error instanceof openai.RateLimitError) {
 //           res.end("ERROR:rate_limit_exceeded");
 //           } else if (error instanceof openai.InternalServerError) {
 //           res.end("ERROR:internal_server_error");
 //           }
        }
      

      res.end();
      break;

    default:
      res.statusCode = 404;
      res.end();
  }

  //???
 ///   
});
  