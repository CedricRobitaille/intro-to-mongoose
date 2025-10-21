const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const Customer = require("./models/customer.js");
const prompt = require("prompt-sync")();



const connect = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
}

const disconnect = async () => {
  await mongoose.connection.close();
  console.log("Disconnected from MongoDB");
  process.exit;
}


// Menu Overviews
const rootOverview = () => {
  console.log(`What would you like to do?`);
  console.log(`
    1. Create a customer
    2. View all customers
    3. Update a customer
    4. Delete a customer
    5. Quit`)
    console.log("")
}


const userInput = (description) => {
  const input = prompt(`${description} `);
  return input;
}





const rootInput = () => {
  rootOverview()
  inputRouting(userInput("Select an action number: ")) 
}

const createInput = async () => {
  console.log("Creating a new Customer...")

  console.log("\nInput the customer's name:")
  const customerName = prompt("> ");

  console.log("\nInput the customer's age:")
  const customerAge = prompt("> ");


  console.log("\nCreating customer...")
  const createdCustomer = await Customer.create({
    name: customerName,
    age: customerAge,
  });
  console.clear();

  console.log("You have created the following customer:")
  console.log(`  ID: ${createdCustomer._id}, Name: ${createdCustomer.name}, Age: ${createdCustomer.age}`)
  console.log("\nPress any key to continue.")
  prompt("> ");
  inputRouting("root");
}

const readInput = async () => {
  console.log("Loading Customers...")
  const customers = await Customer.find({})
  console.clear();

  console.log("Below is a list of customers:\n")
  customers.forEach((customer) => {
    console.log(`   Name: ${customer.name}, Age: ${customer.age} --  ID: ${customer._id},`)
  })
  

  prompt("\nPress any key to continue\n> ")
  inputRouting("root");
}



const updateInput = async () => {
  console.log("Loading Customers...")
  const customers = await Customer.find({})
  console.clear();

  console.log("Below is a list of customers:")
  customers.forEach((customer, index) => {
    console.log(`  #${index} --  ID: ${customer._id}, Name: ${customer.name}, Age: ${customer.age}`)
  })

  const customerById = async () => {
    console.log("\nSelect the `Index` of the customer you'd like to update:")
    const customerIndex = prompt("> ");
    return customers[parseInt(customerIndex)]
  }

  const customerData = await customerById();

  console.clear();
  console.log(`You are editing the customer:`)
  console.log(`  ID: ${customerData._id}`)
  console.log(`  Name: ${customerData.name}`)
  console.log(`  Age: ${customerData.age}`)
  
  console.log("\nWhat is the customer's revised name?")
  const newName = prompt("> ")

  console.log("\nWhat is the customer's revised age?")
  const newAge = prompt("> ")

  console.log("Updating Customer")
  let updatedCustomer = {}
  try {
    updatedCustomer = await Customer.findByIdAndUpdate(
      customerData.id,
      {
        name: newName,
        age: newAge,
      },
      { new:true }
    );
  } catch (error) {
    console.log(error)
  }
  
  console.log("The customer has been updated.")
  console.log(`  ID: ${customerData.id}`)
  console.log(`  Name: ${updatedCustomer.name}`)
  console.log(`  Age: ${updatedCustomer.age}`)

  console.log("")
  console.log("Press any key to return to home:")
  prompt("> ");

  inputRouting("root")
}

const deleteInput = async () => {
  console.log("Loading Customers...")
  const customers = await Customer.find({})
  console.clear();

  console.log("Below is a list of customers:")
  customers.forEach((customer, index) => {
    console.log(`  #${index} --  ID: ${customer._id}, Name: ${customer.name}, Age: ${customer.age}`)
  })

  const customerById = async () => {
    console.log();
    console.log("\nSelect the `Index` of the customer you'd like to delete:")
    const customerIndex = prompt("> ");
    return customers[parseInt(customerIndex)]
  }

  const customerData = await customerById();
  console.clear();
  console.log("You are attempting to delete the user:")
  console.log(`  ID: ${customerData._id}, Name: ${customerData.name}, Age: ${customerData.age}\n`);

  const confirmation = () => {
    let input = prompt("(Yes / No) ")
    console.log(input)
    if (input != "Yes" && input != "No") {
      console.log("\nInvalid Response...")
      input = confirmation()
    }
    return input;
  }
  console.log("Are you sure you want to delete this customer data ?")
  const confirmationInput = confirmation();

  if (confirmationInput === "Yes") {
    console.log("Deleting Customer Data...")
    const deletedCustomer = await Customer.findByIdAndDelete(customerData.id);
    console.clear();
    console.log("You have deleted the following customer information:")
    console.log(`  Name: ${deletedCustomer.name}, Age: ${deletedCustomer.age}\n`);
    console.log("\nTo return Home, press any key:")
    prompt("> ")
    inputRouting("root");
  } else {
    console.clear();
    console.log("We will not remove this customer from the database.")
    console.log("\nTo return to selection, press any key:")
    prompt("> ")
    deleteInput();
  }

}

const inputRouting = (state) => {
  let input = state;
  console.clear();
  if (input != "root") {
    if (parseInt(input) < 1 && parseInt(input) > "5") {
      console.log("THIS")
      input = "root"
    }
  }
  // console.clear();
  switch (input) {
    case ("root"):
      rootInput();
      break;

    case ("1"):
      createInput()
      break;

    case ("2"):
      readInput()
      break;

    case ("3"):
      updateInput()
      break;

    case ("4"):
      deleteInput()
      break;
    
    case ("5"):
      disconnect()
      break;
  }
}


const startUp = async () => {
  connect()
    .then(() => {
      inputRouting("root");
    })
}

startUp();
