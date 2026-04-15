import Elysia from "elysia";
import { routes_global } from "./routes";
import { openapi } from "@elysiajs/openapi";
import { cors } from "@elysiajs/cors";
import { OpenAPI } from "../plugins/better_auth";
import { cron } from "@elysiajs/cron";
import { matches_service } from "../modules/matches";


const list_cors_origins=[
    "http://localhost:3000",
    "http://localhost:3001",
]
const intervalMs = Number(Bun.env.MATCH_CRON_INTERVAL_MS || 300000)
const minScore = Number(Bun.env.MATCH_MIN_SCORE || 55)

// converter ms → expressão cron
// ex: 300000ms = 5 min → */5 * * * *
const intervalSeconds = Math.floor(intervalMs / 1000)

let pattern = '*/5 * * * *' // fallback

if (intervalSeconds < 60) {
  // roda em segundos
  pattern = `*/${intervalSeconds} * * * * *`
} else {
  const minutes = Math.floor(intervalSeconds / 60)
  pattern = `*/${minutes} * * * *`
}

 const app=new Elysia()
.use(cors({
    origin:list_cors_origins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            credentials: true,
            allowedHeaders: ['Content-Type', 'Authorization']
}))
.use(openapi({
    path:"/openapi",
    documentation:{
        components: await OpenAPI.components,
            paths: await OpenAPI.getPaths(),
        info:{
            title:"BENGUELA SOS API",
            version:"1.0.0",
            description:"API BENGUELA SOS"
        }
    }
}))
.use(routes_global)
.use(
    cron({
      name: 'matches-cron',
      pattern,
      async run() {
        try {
          const result = await matches_service.runMatching(minScore)
          console.log('[matches-cron] run completed', result)
        } catch (error) {
          console.error('[matches-cron] run failed', error)
        }
      }
    })
)
.get("/",async({status})=>{
   return status("OK",{
        message:"OK"
    })
})
.compile()

export default app