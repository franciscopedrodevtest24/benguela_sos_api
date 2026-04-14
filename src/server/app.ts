import Elysia from "elysia";
import { routes_global } from "./routes";
import { openapi } from "@elysiajs/openapi";
import { cors } from "@elysiajs/cors";


const list_cors_origins=[
    "http://localhost:3000",
    "http://localhost:3001",
]


 const app=new Elysia()
.use(cors({
    origin:list_cors_origins,
    credentials:true
}))
.use(openapi({
    path:"/openapi",
    documentation:{
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