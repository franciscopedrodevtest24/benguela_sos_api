import { start_matches_cron } from "./modules/matches/matches.cron";
import app from "./server/app";

// const SERVER_CONFIG={
//   port:parseInt(Bun.env.PORT||"3001"),
//   hostname:"0.0.0.0"
// }


// const initial_app=app.listen({
//   port:SERVER_CONFIG.port,
//   hostname:SERVER_CONFIG.hostname,
//   idleTimeout:65
// })



Bun.serve({
  port:3000,
  hostname:"0.0.0.0",
  idleTimeout:65,
  fetch:async(req)=>{
   console.log(`SERVER RUNNING  http://localhost:3000`)
        start_matches_cron()

    return await app.handle(req)
  },

})



