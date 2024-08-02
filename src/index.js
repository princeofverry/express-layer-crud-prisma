const express = require("express");
const dotenv = require("dotenv");
// panggil prisma
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());

app.get("/api", (req, res) => {
  // ngerespond
  res.send("helaw jon");
});

app.get("/products", async (req, res) => {
  const products = await prisma.product.findMany();

  res.send(products);
});

app.get("/products/:id", async (req, res) => {
  const productId = req.params.id;

  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(productId),
    },
  });
  if (!product) {
    return res.status(404).send("product not found");
  }

  res.send(product);
});

app.post("/products", async (req, res) => {
  const newProductData = req.body;
  const product = await prisma.product.create({
    data: {
      name: newProductData.name,
      description: newProductData.description,
      image: newProductData.image,
      price: newProductData.price,
    },
  });

  // status 201 created (means)
  res.send({
    data: product,
    message: "created successfully",
  });
});

app.delete("/products/:id", async (req, res) => {
  // ngambil params ":"
  const productId = req.params.id; // masih string

  await prisma.product.delete({
    where: {
      id: parseInt(productId),
    },
  });

  res.send("product deleted");
});

// patch -> menambal jadi ga semuanya
// put -> replace

app.put("/products/:id", async (req, res) => {
  // put ambil id sama body-nya (combine post delete)
  const productId = req.params.id; //ambil params id
  const productdata = req.body;

  if (
    !(
      productdata.image &&
      productdata.description &&
      productdata.name &&
      productdata.price
    )
  ) {
    return res.status(400).send("some field are missing");
  }

  const product = await prisma.product.update({
    where: {
      id: Number(productId),
    },
    data: {
      description: productdata.description,
      name: productdata.name,
      image: productdata.image,
      price: productdata.price,
    },
  });
  res.send({
    data: product,
    message: "update successfully",
  });
});

app.patch("/products/:id", async (req, res) => {
  // put ambil id sama body-nya (combine post delete)
  const productId = req.params.id; //ambil params id
  const productdata = req.body; // ambil data-nya

  const product = await prisma.product.update({
    where: {
      id: Number(productId),
    },
    data: {
      description: productdata.description,
      name: productdata.name,
      image: productdata.image,
      price: productdata.price,
    },
  });
  res.send({
    data: product,
    message: "update successfully",
  });
});

app.listen(PORT, () => {
  console.log("express API running in port: " + PORT);
});
