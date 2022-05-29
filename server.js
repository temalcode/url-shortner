//express
const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs')
//dotenv
if(process.env.NODE_ENV != 'production')
    require('dotenv').config()
//mongoose
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE, () => console.log('connected to the database'))
const urlModel = require('./model')
//method override
const methosOverride = require('method-override')
app.use(methosOverride('_method'))

app.get('/', async (req, res) => {
    try{
        let allUrls = await urlModel.find()
        res.render('index', {allUrls})
    } catch(err){
        res.status(500).send(err.message)
    }
})

app.post('/create', async (req, res) => {
    try{
        let newUrl = new urlModel({fullUrl: req.body.fullurl})
        await newUrl.save()
        res.redirect('/')
    } catch(err){
        res.status(500).send(err.message)
    }
})

app.get('/:shortId', async (req, res) => {
    try{
        let url = await urlModel.findOne({short: req.params.shortId})
        if(url){
            url.clicks++
            await url.save()
            res.redirect(url.fullUrl)
        }
        else
            res.status(400).send('url is not registered')
    } catch(err){
        res.status(500).send(err.message)
    }
})

app.delete('/delete/:shortId', async (req, res) => {
    try{
        await urlModel.findOneAndDelete({short: req.params.shortId})
        res.redirect('/')
    } catch(err){
        res.status(500).send(err.message)
    }
})

app.delete('/deleteall', async (req, res) => {
    try{
        await urlModel.deleteMany()
        res.redirect('/')
    } catch(err){
        res.status(500).send(err.message)
    }
})

app.listen(process.env.PORT || 5000, () => console.log('server is running'))