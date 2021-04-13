const express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
const { ObjectId } = require('mongodb')
require('dotenv').config()
const port = process.env.PORT || 5000
const app = express()
app.use(bodyParser.json());
app.use(cors());

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.edbhc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {


	const appointmentCollection = client.db("doctors-portal").collection("appointment");
	const doctorCollection = client.db("doctors-portal").collection("doctors");
	//Create
	app.post('/addAppointment', (req, res) => {
		const appointment = req.body;
		appointmentCollection.insertOne(appointment)
			.then(result => {
				res.send(result.insertedCount > 0)
			})
	})
	//Create
	app.post('/addDoctor', (req, res) => {
		const doctor = req.body;
		doctorCollection.insertOne(doctor)
			.then(result => {
				console.log("data added succesfully", result);
				res.redirect('/')
			})
	})
	//Read
	app.get('/appointments', (req, res) => {
		appointmentCollection.find({})
			.toArray((err, documents) => {
				res.send(documents);
			})
	})
	//Read
	app.get('/doctors', (req, res) => {
		doctorCollection.find({})
			.toArray((err, documents) => {
				res.send(documents);
			})
	})
	//Post
	app.post('/appointmentsByDate', (req, res) => {
		const date = req.body;
		const email = req.body.email;
		doctorCollection.find({ date: date.date })
			.toArray((err, doctors) => {
				const filter = { date: date.date }
				if(doctors.length === 0) {
					filter.email = email;
				}
				appointmentCollection.find(filter)
				.toArray((err, documents) => {
					res.send(documents)
				})
			})

	})
	//Read
	// app.get('/product/:id', (req, res) => {
	// 	appointmentCollection.find({ _id: ObjectId(req.params.id) })
	// 		.toArray((err, documents) => {
	// 			res.send(documents[0])
	// 		})
	// })
	//delete
	// app.delete('/delete/:id', (req, res) => {
	// 	appointmentCollection.deleteOne({ _id: ObjectId(req.params.id) })
	// 		.then(result => {
	// 			res.send(result.deletedCount > 0)
	// 		})
	// })
	//patch
	// app.patch('/update/:id', (req, res) => {
	// 	appointmentCollection.updateOne({ _id: ObjectId(req.params.id) },
	// 		{
	// 			$set: { price: req.body.price, quantity: req.body.quantity }
	// 		}
	// 	)
	// 		.then(result => {
	// 			res.send(result.modifiedCount > 0)
	// 		})

	// })
	//end CRUD


});

app.listen(port)

// npm install dotenv express mongodb body-parser cors nodemon
//create .env file
//DB_USER=marufpbt
// DB_PASS=MarufCU97259725
// DB_NAME=doctors-portal
