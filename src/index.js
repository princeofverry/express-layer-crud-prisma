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

app.put("/products/:id", async (req, res) => {
  // put ambil id sama body-nya (combine post delete)
  const productId = req.params.id; //ambil params id
  const productdata = req.body;

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
