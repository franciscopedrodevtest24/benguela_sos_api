import { start_matches_cron } from "./modules/matches/matches.cron";
import app from "./server/app";

const SERVER_CONFIG={
  port:parseInt(Bun.env.PORT||"3001"),
  hostname:"0.0.0.0"
}


const initial_app=app.listen({
  port:SERVER_CONFIG.port,
  hostname:SERVER_CONFIG.hostname,
  idleTimeout:65
})


if(initial_app.server){
  console.log(`SERVER RUNNING  http://localhost:${SERVER_CONFIG.port}`)
  start_matches_cron()
}else{
  console.error("ERROR SERVER")
  process.exit()
}

export default initial_app