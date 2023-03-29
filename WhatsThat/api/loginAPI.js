import AsyncStorage from '@react-native-async-storage/async-storage';

async  function loginAPI  (email, password, success, failure)  {
    // Validation here...
    let toSend = {
        // email: this.state.email,
        // password: this.state.password
        email,
        password
    };

    console.log(toSend)
    
    fetch("http://localhost:3333/api/1.0.0/login", {
        method: "post",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(toSend),
    })
    .then(async(response) => {
        if (response.status === 200) {
        console.log("User logged in: ", response);
       // alert("Login successful!");

            //converting response to JSON
        const responseJson = await response.json();
        const sessionID =  responseJson.token;
        const id = responseJson.id;
        //stores the session token and user id
        AsyncStorage.setItem("userID", id)
        AsyncStorage.setItem("userToken", sessionID)
       // console.log(sessionID, id, responseJson);
        success()

        // Save user token or other relevant data
        // Navigate to dashboard or home screen
        } 

        else if (response.status === 400)
        {
        console.log("Login failed: ", response);
        alert("Invalid email or password");
        failure(new Error("400"));
        }
    
    })
    .catch((error) => {
        console.log(error);
    });
   }

   


   export{
    loginAPI
   }
