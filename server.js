require('dotenv').config()

const express = require('express')
const superagent = require('superagent')
const pg = require('pg')
const methodOverride = require('method-override')

const app = express()
const PORT = process.env.PORT
const client = new pg.Client(process.env.DATABASE_URL)

app.use(express.urlencoded({extended : true}))
app.use(express.static('./public'))
app.use(methodOverride('_method'))
app.set('view engine','ejs')

client.connect()
.then(()=>{
    app.listen(PORT , ()=>{
        console.log( ' i am runinug')
    })
})



// ==============================================================ROUTER ==================================
app.get('/',indexhHandler)
app.get('/search',searchHandler)
app.get('/add',addHandler)
app.get('/myFave',myFavHandler)
app.get('/details/:id',detailsHandler)
app.put('/update/:id',updateHandler)
app.put('/delete/:id',deleteHandler)


// ==============================================================handler ==================================


// ==============================================================searchHandler ==================================
function indexhHandler(req,res){
    res.render('index_page')
}

// ==============================================================searchHandler ==================================
function searchHandler (req, res){
   let search_query = req.query.search_query
   console.log(search_query)

   let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&query=${search_query}`
   superagent.get(url).then(movieData=>{
    //    console.log(movieData.body.results)
   let movieArray = movieData.body.results.map(val =>{
    return new Movie(val)
   })
   res.render('search_page' ,{data :movieArray})

   })
}

// ==============================================================addHandler ==================================
function addHandler  (req,res){
    let {title ,image_url , overview} = req.query
    console.log(req.query)
let sql = ` INSERT INTO movie (title ,image_url , overview)
VALUES ($1, $2, $3 );`

let safVal=[title ,image_url , overview]
client.query(sql,safVal).then(()=>{
    res.redirect('/myFave')
})
}




// ==============================================================myFavHandler ==================================
function myFavHandler(req,res){
    let sql = `SELECT * FROM movie;`
    client.query(sql).then(data=>{
        res.render('fav_page', {data:data.rows})
    })
}

// ==============================================================detailsHandler ==================================
function detailsHandler (req,res){
    param = req.params.id
    console.log(param)
    let sql = `SELECT * FROM movie WHERE id =$1;`
    let safVal = [param]
    client.query(sql,safVal).then((data)=>{
        res.render('details', {data:data.rows[0]})
    })
}



// ==============================================================updateHandler ==================================

function updateHandler (req,res){
    param = req.params.id
    let {title ,image_url , overview} = req.body
    console.log(req.body)

    let sql = `UPDATE movie
    SET title = $1, image_url = $2, overview = $3
     WHERE id =$4;`
    let safVal = [title ,image_url , overview ,param]
    client.query(sql,safVal).then(()=>{
        res.redirect(`/details/${param}`)
    })
}



// ==============================================================deleteHandler ==================================
function deleteHandler (req,res){
    param = req.params.id

    let sql = `DELETE FROM movie 

     WHERE id =$1;`
    let safVal = [param]
    client.query(sql,safVal).then(()=>{
        res.redirect(`/myFave`)
    })
}


// ==============================================================updateHandler ==================================

// ==============================================================constuctor ==================================
function Movie(val){

    this.title = val.title
    this.overview = val.overview
    this.image_url = `https://image.tmdb.org/t/p/w500${val.poster_path}`;  
      
}