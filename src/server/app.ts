import Elysia from "elysia";
import { routes_global } from "./routes";
import { openapi } from "@elysiajs/openapi";
import { cors } from "@elysiajs/cors";
import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker'
import { OpenAPI } from "../plugins/better_auth";


const list_cors_origins=[
    "http://localhost:3000",
    "http://localhost:3001",
]


 const app=new Elysia({
    adapter: CloudflareAdapter 
 })
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

.get("/",async({status})=>{
   return status("OK",{
        message:"OK"
    })
})
.compile()

export default app