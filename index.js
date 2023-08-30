/*
    Erőforrás:
        Product {
            id: string
            name: string
            price: number
            isInStock: boolean
        }
    Operációk:
        Create, Read, Update, Delete (CRUD)
*/
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const { log } = require('console');

// Read
app.get('/products', (req, res) => {
  fs.readFile('./data/products.json', (err, file) => {
    res.send(JSON.parse(file));
  })
});

// Read by id
app.get('/products/:egyediAzonosito', (req, res) => {
  const id = req.params.egyediAzonosito; 
  fs.readFile('./data/products.json', (err, file) => {
    const products = JSON.parse(file);
    const productbyID = products.find(product => product.id === id);
    if(!productbyID) {
      res.status(404);
      res.send({error: `id: ${id} not  found` });
      return;
    }
     
     res.send(productbyID);
  });
});

//Create
app.post('/products', bodyParser.json(), (req, res) => {
  const newProduct = {
    id: uuidv4(),
    name: sanitizeString(req.body.name),
    price: Number(req.body.price),
    isInStock: Boolean(req.body.isInStock),
  };
  fs.readFile('./data/products.json', (err, file) => {
    const products = JSON.parse(file);
    products.push(newProduct);
    fs.writeFile('./data/products.json', JSON.stringify(products), (err) => {
      res.send(newProduct);
    })
  })
});



// Update
app.put('/products/:egyediAzonosito', bodyParser.json(), (req, res) => {
  const id = req.params.egyediAzonosito; 
  fs.readFile('./data/products.json', (err, file) => {
    const products = JSON.parse(file);
    const productIndexbyID = products.findIndex(product => product.id === id);
    if(productIndexbyID === -1) {
      res.status(404);
      res.send({error: `id: ${id} not  found` });
      return;
    }
     
    const updatedProduct = {
      id: id,
      name: sanitizeString(req.body.name),
      price: Number(req.body.price),
      isInStock: Boolean(req.body.isInStock),
    };
    products[productIndexbyID]=updatedProduct;
    fs.writeFile('./data/products.json', JSON.stringify(products), () => {
       res.send(updatedProduct);
    });
  });
});

// Delete
app.delete('/products/:egyediAzonosito', (req, res) => {
  const id = req.params.egyediAzonosito; 
  fs.readFile('./data/products.json', (err, file) => {
    const products = JSON.parse(file);
    const productIndexbyID = products.findIndex(product => product.id === id);
    if(productIndexbyID === -1) {
      res.status(404);
      res.send({error: `id: ${id} not  found` });
      return;
    }
     
    products.splice(productIndexbyID, 1);
    fs.writeFile('./data/products.json', JSON.stringify(products), () => {
       res.send({id: id});
    });
  });
});

app.listen(3000);

function sanitizeString(str){
  str = str.replace(/[^a-z0-9áéíóúñü_-\s\.,]/gim,"");
  return str.trim();
  };

  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }