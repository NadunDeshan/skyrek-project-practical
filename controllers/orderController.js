import Order from "../models/order.js";

export async function createOrder(req, res) {
  try {
    const orderList = await Order.find().sort({ date: -1 }).limit(1);

    let newOrderID = "ND0000001";

    if (orderList.length !== 0) {
      const lastOrderIDInString = String(orderList[0].orderID); // "ND0000123"
      const lastOrderNumberInString = lastOrderIDInString.replace("ND", ""); // "0000123"
      const lastOrderNumber = parseInt(lastOrderNumberInString, 10); // 123
      const newOrderNumber = lastOrderNumber + 1; // 124
      const newOrderNumberInString = newOrderNumber.toString().padStart(7, "0"); // "0000124"
      newOrderID = "ND" + newOrderNumberInString;
    }

    const newOrder = new Order({
      orderID: newOrderID,
      items: [],
      customerName: req.body.customerName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      total: req.body.total,
      status: "Pending",
    });

    const saveOrder = await newOrder.save();

    return res.status(201).json({
      message: "Order created successfully",
      order: saveOrder,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}









// import Order from "../models/order.js";

// export async function createOrder(req,res){
//     //ND0000001

//     // if(req.user == null){
//     //     res.status(401).json({
//     //         message : "Unauthorized user"
//     //     }
//     // )
//     //     return;
//     //}
//     try{
//         const orderList= await Order.find().sort({date:-1}).limit(1);

//         let newOrderID = "ND0000001";

//         if(orderList.length != 0){
//             let lastOrderIDInString = orderList[0].orderID; //ND0000123
//             let lastOrderNumberInSreing = lastOrderIDInString.repalce("ND","")//0000123
//             let lastOrderNumber = parseInt(lastOrderNumberInString); //123
//             let newOrderNumber = lastOrderNumber + 1; //124
//             //padStart
//             let newOrderNumberInString = newOrderNumber.toString().padStart(7,"0"); //0000124

//             newOrderID = "ND" + newOrderNumberInString;
            
//         }
//         const newOrder = new Order({
//             orderID: newOrderID,
//             items :[],
//             customerName : req.body.customerName,
//             email : req.body.email,
//             phone : req.body.phone,
//             address : req.body.address,
//             total: req.body.total,
//             status: "Pending"
            
//         })
//         const saveOrder = await newOrder.save()

//         res.json(201).json({
//             message : "Order created successfully",
//             order : newOrder
//         })

        


//     }catch(err){
//         console.error(err);
//         res.status(500).json({
//             message : "Internal server error"
//         });
//     }

// }