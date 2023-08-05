const { log } = require('console');
const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceElemente = require('./starter/modules/replaceElemente');

/////////////////////////////////////
// FILES

// blocking , synchornomus way
// const textIn = fs.readFileSync('./starter/txt/input.txt', 'utf8');
// console.log(textIn);

// const textOut =  `this is what we knew about the avocado: ${textIn}\n ${Date.now()}`;
// fs.writeFileSync('./starter/txt/output.txt', textOut);
// console.log('file writen!');


// None-blocking , asynchornomus way       Calback Hell!
// fs.readFile('./starter/txt/start.txt', 'utf-8' , (err ,data1)=>{
//     fs.readFile(`./starter/txt/${data1}.txt`, 'utf-8', (err ,data2)=>{
//         console.log(data2);
//         fs.readFile(`./starter/txt/append.txt`, 'utf-8', (err ,data3)=>{
//             console.log(data3);
            


//             fs.writeFile('./starter/txt/final.txt', `${data2}\n ${data3}`,'utf-8', (err )=>{
//                 console.log('Tour file has been created');
//             })
//         })
        
//     })
// })

/////////////////////////////////////
// SERVER

//  "id": 0,
    // "productName": "Fresh Avocados",
    // "image": "🥑",
    // "from": "Spain",
    // "nutrients": "Vitamin B, Vitamin K",
    // "quantity": "4 🥑",
    // "price": "6.50",
    // "organic": true,
    // "description": "A ripe 


 const overview_tamplate = fs.readFileSync(`${__dirname}/starter/templates/overview.html`,'utf-8')
 const card_tempalte = fs.readFileSync(`${__dirname}/starter/templates/card.html`,'utf-8')
 const product_template = fs.readFileSync(`${__dirname}/starter/templates/product.html`,'utf-8')


 const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`,'utf-8');
 const dataObj = JSON.parse(data);


    //the router --server 
const server = http.createServer((req, res)=>{
    const pathName = req.url;
    const { pathname , query} = url.parse(req.url , true);
      
    // overview page
    if(pathname === '/' || pathname === '/overview'){
      res.writeHead(200,{"content-type":"text/html"});
     const cardsHtml = dataObj.map(element => replaceElemente(card_tempalte, element)).join('');
    const output = overview_tamplate.replace('{%productCards%}',cardsHtml)
     res.end(output);

    // product page
    }else if(pathname === '/product'){
        res.writeHead(200,{"content-type":"text/html"});
        const product = dataObj[query.id];
        const output =replaceElemente(product_template, product);
         res.end(output);
    // API
    }else if(pathname === '/api'){
        res.writeHead(200,{'content-type': 'application/json'});
        res.end(data);
    }else{
        res.writeHead(404,{
            'Content-type': 'text/html',
            'my-own-content':'hellow world'
        })
       
        res.end('<h1>Page Not Found! </h1>')
    }
});


server.listen('8000', '127.0.0.1', ()=>{
console.log('Listening to the requset on port 8000');
})

