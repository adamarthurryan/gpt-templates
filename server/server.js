import 'dotenv/config';

import OpenAI from "openai";
import http from "http";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const server = http.createServer();
server.listen(3000);

server.on("request", async (req, res) => {
  switch (req.url) {
    case "server":
        console.log("server request");
        const config = {
            model: "gpt-4",
            stream: true,
            messages: [
            {
                content: "Once upon a time",
                role: "user",
            },
            ],
        };
        try {
            const completion = await openai.chat.completions.create(config);
            res.writeHead(200, {
                "Content-Type": "text/plain; charset=utf-8",
            });
    
            for await (const chunk of completion) {
                const [choice] = chunk.choices;
                const { content } = choice.delta;
                if (choice.finish_reason === "length") {
                    res.write("ERROR:token_limit_reached");
                } else {
                    console.log(content);
                    res.write(content);
                }
            }
        } catch (error) {
            if (error instanceof openai.RateLimitError) {
            res.end("ERROR:rate_limit_exceeded");
            } else if (error instanceof openai.InternalServerError) {
            res.end("ERROR:internal_server_error");
            }
        }
      

      res.end();
      break;

    default:
      res.statusCode = 404;
      res.end();
  }

  //???
 ///   req.on("close", () => {
  //      completion.controller.abort();
  //   });
});
  