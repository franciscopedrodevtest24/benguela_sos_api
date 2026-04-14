import { Context } from "elysia";
import { start_matches_cron } from "./modules/matches/matches.cron";
import app from "./server/app";
import { Env } from "bun";

// const SERVER_CONFIG={
//   port:parseInt(Bun.env.PORT||"3001"),
//   hostname:"0.0.0.0"
// }


// const initial_app=app.listen({
//   port:SERVER_CONFIG.port,
//   hostname:SERVER_CONFIG.hostname,
//   idleTimeout:65
// })


export default{

  fetch:async(
    request: Request,
    env: Env,
    ctx: Context,
  ):Promise<Response>=>{
    console.log(`SERVER RUNNING  http://localhost:3000`)
    start_matches_cron()
    const pathname = new URL(request.url).pathname

    return await app.fetch(request)
  },
}






