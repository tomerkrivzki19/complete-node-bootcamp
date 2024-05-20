import axios from 'axios'
// problems with axios ---FIX --> lecture number: 189 , 11:33

const login = async(email,password)=>{
    console.log(email,password);
    try {
        //  axios => call api instead of resolve reject promisess | we imported the axios package as cdn in the base scripts
        //resolve -> !(not) response 
        const res =  await axios({
            methods: 'POST',
            url: 'http://192.168.68.108:8000/api/v1/users/login',
            data: {
                email,
                password
            }
        })
        console.log(res);
    } catch (error) {
        console.log(error);
    }
}


document.querySelector('.form').addEventListener('submit',e =>{
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email,password);
    
})