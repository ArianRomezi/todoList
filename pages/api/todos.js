import { getSession } from "next-auth/react";
import connectDB from "../../utils/connectDB";
import User from "../../models/User"
import { sortTodos } from "../../utils/sortTodos";  



async function handler(req,res){
    try {
        await connectDB();
      } catch (err) {
        console.log(err);
        return res
          .status(500)
          .json({ status: "failed", message: "Error in connecting to DB" });
      }


      const session=await getSession({req});
      if(!session) return res.status(401).json({status:'failed',massage:"you are not loged in"})

        const user=await User.findOne({email:session.user.email});

        if(!user) return res.status(404).json({ status: "failed", message: "User dosnt exsist" });

    if(req.method==="POST"){

        const{title,status}=req.body;

        if(!title||!status){ return res.status(422).json({status:"failed",massage:"Invalid data"});
        }
        user.todos.push({title:title,status:status});  
        user.save();

        res.status(201).json({status:"success",massage:"Todo created"});
    }else if(req.method==="GET"){
      const sortedData=sortTodos(user.todos);
      res.status(200).json({status:"success",data:{todos:sortedData} });
    }else if(req.mathod==="PATCH"){
      const{id,status}=req.body;

      if(!id||!status){return res.status(422).json({status:"failed",massage:"Invalid Data!"})};

      const result=await User.updateOne({"todos._id":id},{$set:{"todo.$.status":status}})
      
      res.status(200).json({status:"success"})

    }
   

}


export default handler;