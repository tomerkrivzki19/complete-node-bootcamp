const { log } = require('console');
const fs = require('fs');
const http = require('http');
const url = require('url');

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
// can use `${__dirname}, but for some reason not working for me.
 const data = fs.readFileSync('./starter/dev-data/data.json','utf-8');
 const dataObj = JSON.parse(data);
//  console.log(data);
const server = http.createServer((req, res)=>{

    const pathName = req.url;

    if(pathName === '/' || pathName === '/overview'){
        res.end('This is the OVERVIEW ');
      
    }else if(pathName === '/product'){
        res.end('This is the PRODUCT')
    }else if(pathName === '/api'){
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

