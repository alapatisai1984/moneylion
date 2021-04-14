# moneylion
1. Please create db and table usning the sql query added to the script 

2. Change the db settings from config/constant.js

3. Start the application by run the command
    node index.js 

4. GET API 
   http://localhost:5000/feature?email=sai@sai.com&featureName=sai
   will recive a response like 
   {
    "canAccess": false
   }

5. POST API 
  http://localhost:5000/feature 
  {
    "featureName" : "sai",
    "email" : "sai@sai.com",
    "enable" : true
}

// if there is already record exist for the email and featureName Application will try to update it 
   else it will create the record 
   if sucessfully created/updated will return http code 200 with empty response 
   else it will return with http code 304 
