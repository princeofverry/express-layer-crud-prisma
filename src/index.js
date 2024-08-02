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

app.listen(PORT, () => {
  console.log("express API running in port: " + PORT);
});
