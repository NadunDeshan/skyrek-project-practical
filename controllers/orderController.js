import Order from "../models/order.js";
import Product from "../models/product.js";
import { isAdmin, isCustomer } from "./userController.js";

export async function createOrder(req, res) {




  try {
    const user = req.user;
    if (user == null) {
       res.status(401).json(
        {
        message: "Unauthorized user",
        }
    )
    return
    }


    
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

    let customerName = req.body.customerName;
    if (customerName == null) {
      customerName = user.firstName + " " + user.lastName;
    }

    let phone = req.body.phone;
    if (phone == null) {
      phone = "Not Provided";
    }

    const itemsInRequest = req.body.items;

    if(itemsInRequest == null){
         res.status(400).json({
            message : "Items are required to create an order"
        }
      )
      return
    }
    if(!Array.isArray(itemsInRequest)){
         res.status(400).json({
            message : "Items must be an array"
        }
      )
      return
    }

    const itemsToBeAdded = []
    let total = 0

    for(let i=0;i<itemsInRequest.length;i++){
        const item = itemsInRequest[i];

        const product = await Product.findOne({ productID: item.productID });
        if (product == null) {
          res.status(400).json({
            code : "ProductNotFound",
            message: "Product with id " + item.productID + " not found",
            productID: item.productID
          });
          return;
        }
        if(product.stock<item.quantity){
          res.status(400).json({
            code : "stock",
            message: "Insufficient stock for product with id " + item.productID + " in order",
            productID: item.productID,
            availableStock : product.stock
          })
          return
        }
        itemsToBeAdded.push({
          productID: item.productID,
          quantity: item.quantity,
          name: product.name,
          price: product.price,
          image: product.images[0]
        })

        total += product.price * item.quantity
    }


    const newOrder = new Order({
      orderID: newOrderID,
      items: itemsToBeAdded,
      customerName: customerName,
      email: user.email,
      phone: phone,
      address: req.body.address,
      total: total
      // status: "Pending",
    });

    const saveOrder = await newOrder.save();
    //reduced order stock count after place order

    // for(let i=0;i<itemsToBeAdded.length;i++){
    //     const item = itemsToBeAdded[i];
    //     await Product.updateOne(
    //       { productID: item.productID },
    //       { $inc: { stock: -item.quantity } }
    //     );
        
    // }

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

export async function getOrders(req, res) {
  if (isAdmin(req)){
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } else if(isCustomer(req)){
    const user = req.user
    const orders = await Order.find({ email:user.email }).sort({ date: -1 });
    res.json(orders);
  } else {
    res.status(403).json({
      message: "You are not authorized to view orders",
    });
  }
}

export async function updateOrderStatus(req, res) {
  if(!isAdmin(req)){
    res.status(403).json({
      message: "You are not authorized to update an order"
    });
    return;
  }
  const orderID = req.params.orderID;
  const newStatus = req.body.status;

  try{
    await Order.updateOne(
    { orderID: orderID },
    { status: newStatus }
  );
  res.json({
    message: "Order updated successfully",
  });

  }catch(err){
    console.error(err);
    res.status(500).json({
      message : "Failed to update order status"
    })
    return
  }

  
}

export async function getMyOrders(req, res) {
  if (req.user == null) {
    res.status(401).json({
      message: "Unauthorized user",
    });
    return;
  }

  try {
    const orders = await Order.find({
      email: req.user.email,
    }).sort({ date: -1 });

    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to fetch user orders",
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