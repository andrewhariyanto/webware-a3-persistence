const express = require("express"),
  { MongoClient } = require("mongodb"),
  app = express(),
  dir = "public/",
  port = 3000;

require('dotenv').config();


app.use(express.static('public'));
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient(uri)

let collection = null

async function run() {
  await client.connect()
  collection = await client.db("datatest").collection("test")

  app.use((req, res, next) => {
    if (collection !== null) {
      next()
    } else {
      res.status(503).send()
    }
  })

  // route to get all data
  app.get("/getData", async (req, res) => {
    if (collection !== null) {
      const docs = await collection.find({}).toArray()
      console.log(docs)
      res.json(docs)
    }
  })


  //route to submit data
  app.post('/submit', async (req, res) => {
    console.log(req.body)
      today = new Date(),
      diff = new Date(today - start).getFullYear() - 1970,
      deposit = req.body.deposit,
      rate = req.body.rate,
      accrued = deposit * (1 + rate * diff);
    req.body['accrued'] = accrued
    const result = await collection.insertOne(req.body)
    if (collection !== null) {
      const appdata = await collection.find({}).toArray()
      console.log(appdata)
      res.json(appdata)
    }
  })
}

run()

/*
const appdata = [
  {
    deposit: 1000.0,
    startDate: "2022-09-07",
    rate: 0.04,
    accrued: 1040.0,
    id: 1,
  },
  {
    deposit: 2000.0,
    startDate: "2021-09-04",
    rate: 0.04,
    accrued: 2163.23,
    id: 2,
  },
  {
    deposit: 3500.0,
    startDate: "2020-10-04",
    rate: 0.05,
    accrued: 3503.499,
    id: 3,
  },
];


app.get('/', (request, response) => {
  const filename = dir + request.url.slice(1);
  response.sendFile("index.html");
})

app.get('/getData', (request, response) => {
  //const data = JSON.stringify(appdata);
  console.log("first load get data");
  response.json(appdata);
  //response.writeHeader(200, { "Content-Type": "application/json" });
  //response.end(data);
})

app.post('/submit', (request, response) => {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
    console.log(dataString);
  });

  request.on("end", function () {
    console.log(JSON.parse(dataString));

    let data = JSON.parse(dataString),
      start = new Date(data.startDate),
      today = new Date(),
      diff = new Date(today - start).getFullYear() - 1970,
      deposit = data.deposit,
      rate = data.rate,
      accrued = deposit * (1 + rate * diff);

    data["accrued"] = accrued;
    data["id"] = Number(Date.now());

    appdata.push(data);


    response.json(appdata);
    //response.writeHeader(200, "OK", { "Content-Type": "application/json" });
    //console.log(JSON.stringify(appdata));
    //response.end(JSON.stringify(appdata));
  });
})

app.post('/delete', (request, response) => {
  let idValue = "";

  request.on("data", function (data) {
    idValue += data;
  });

  request.on("end", function () {
    console.log(JSON.parse(idValue));

    let obj = JSON.parse(idValue);

    for (let i = 0; i < appdata.length; i++) {
      if (equalObject(obj, appdata[i])) {
        appdata.splice(i, 1);
        break;
      }
    }

    console.log(appdata);
    response.json(appdata);
    //response.writeHeader(200, "OK", { "Content-Type": "application/json" });
    //response.end(JSON.stringify(appdata));
  });
})

app.post('/modify', (request, response) => {
  let modifiedData = "";

  request.on("data", function (data) {
    modifiedData += data;
    console.log(modifiedData);
  });

  request.on("end", function () {
    console.log(JSON.parse(modifiedData));

    let newData = JSON.parse(modifiedData);
    for (let i = 0; i < newData.length; i++) {
      let start = new Date(newData[i].startDate),
        today = new Date(),
        diff = new Date(today - start).getFullYear() - 1970,
        deposit = newData[i].deposit,
        rate = newData[i].rate,
        accrued = deposit * (1 + rate * diff);

      newData[i]["accrued"] = accrued;
      newData[i]["id"] = Number(newData[i]["id"]);
    }

    appdata.splice(0, newData.length, ...newData);

    response.json(appdata);
    //response.writeHeader(200, "OK", { "Content-Type": "application/json" });
    //console.log(JSON.stringify(appdata));
    //response.end(JSON.stringify(appdata));
  });
})

const equalObject = function (obj1, obj2) {
  return obj1.id === obj2.id;
};
*/
app.listen(process.env.PORT || port);
