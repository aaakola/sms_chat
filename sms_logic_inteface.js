/*
 Author:Akola Arthur Alaali

Contact Information
Email:arthurstaurtleo@hotmail.com
     :arthurstaurtleo@gmail.com

phone:+256758855695
created On:23st June 2018 and Modified On:29st June 2018 --> 
*/

var IP = "173.255.219.164"

var ALL_USERS_URL = "http://"+IP+":5000/users";
var LOGIN_URL = "http://"+IP+":5000/login";
var POST_MESSAGE_URL = "http://"+IP+":5000/post_message";
var LOGIN_URL = "http://"+IP+":5000/login";
var READ_INBOX_URL = "http://"+IP+":5000/read_inbox";

var ID;
var CURRENT_MESSAGE;

function logged_in()
{
    if(this.status==200)
    {
        var reply = JSON.parse(this.responseText);
        if(!reply.status)
        {
            display_info("User Not Found");
            return;
        }
        
        //<div id = "login_div">
          //  <input id = "usernameEntry" placeholder = "Type Username">
            //<div id = "login-btn" onclick = "login()">Login</div>
        //</div>
        
        
        ID =reply.id;
        document.getElementById("login_div").style.display="none";
        
        setInterval(get_inbox,1000);
 
    }
    else
    {
        display_info("relpy code: "+this.status);
        return;
    }
}   

function login()
{
    var uname =document.getElementById("usernameEntry").value;
    if (!uname.length)
    {
        display_info( "Please type Username");
        return;
    }
    send_request("post",LOGIN_URL, logged_in, {"uname":uname});
}



function send_request(mthd,url,handler,payload={})
{
    // payload SHOULD be  json object!
    console.log(url);
    var request = new XMLHttpRequest();           /*creates a request object*/
    request.open(mthd, url, true);     /*request.open("MTHD", "URL", ASYNC_BOOL);*/
    request.onload = handler;

    var form =  new FormData();
    form.append("json-payload", JSON.stringify(payload));

    request.send(form);
}

function select_user()
{
    var target = this.getAttribute("cb");
    var custom_checkbox = document.getElementById(target);
    custom_checkbox.innerHTML = custom_checkbox.innerHTML=="." ? "+": ".";// conditional operator  (?)
}

function fetch_users()
{
    send_request("get",ALL_USERS_URL,fetched_users);
}

function fetched_users()
{
    if(this.status==200)
    {
        var data =JSON.parse(this.responseText);
        console.log(this.responseText);
        /*
            <div class ="user">
                <div class="custom_checkbox" id="cb1">.</div>
                <div class="username" cb="cb1" onclick="select_user(this)">Arthur</div>
            </div>
        */
        
        var mom = document.getElementById("users");
        var entry_div, cb_div, uname_div;
        
        for(var i=0; i<data.length; ++i) // the attribute cb has the properties of the id declared in the div of id =Cb1.
        {
            entry_div = document.createElement("div");
                entry_div.setAttribute("class","user");
                
            cb_div = document.createElement("div");
                cb_div.setAttribute("class","custom_checkbox");
               cb_div.setAttribute("id",data[i][0]);
                cb_div.innerHTML = ".";
                
            uname_div = document.createElement("div");
                 uname_div.setAttribute("class","username");
                 uname_div.setAttribute("cb",data[i][0]);
                 uname_div.onclick = select_user;
                 uname_div.innerHTML = data[i][1];
            
            entry_div.appendChild(cb_div);
            entry_div.appendChild(uname_div);
            
            mom.appendChild(entry_div);
        }
        
    }
    else
    {
        console.log(reply.status);
        display_info("relpy code: "+this.status);
        return;
    }
}

function dismiss_info()
{
    document.getElementById("info").style.display="none";


}

function dismiss_userlist()
{
    document.getElementById("user_list").style.display="none";
}

function display_users()
{
        var msg =document.getElementById("entry").value;
        //console.log(msg);
        if(!msg.length)
        {
            display_info("please Type Something");
            return;
        }
        document.getElementById("user_list").style.display= "block";     
}

function populate_messages(messages=[])
{
   /* <div class = "chatbox incoming outline-color" >
            <div class="left-indent recipent">  Daisy </div>
            <div class="left-indent"> Hey Arthur</div>
            <div class = "time time-received">time received </div>
        </div> */
        
        //<div id = "message_div" class = "hasborder div_layout"></div>
                                                           
                                                          
        var chat_div,sender_div,msg_div,time_div;        
                                                        
        var mom = document.getElementById("message_div");
        
        for(var i=0; i<messages.length; ++i)
        {
            chat_div= document.createElement("div");
                chat_div.setAttribute("class","chatbox incoming outline-color");             
                    
                    
                
            sender_div= document.createElement("div");
                sender_div.setAttribute("class","left-indent recipent");
                sender_div.innerHTML = messages[i][1]; 
            
            
            msg_div= document.createElement("div");
                msg_div.setAttribute("class","left-indent");
                msg_div.innerHTML = messages[i][2];
            
            
            time_div= document.createElement("div");
                time_div.setAttribute("class","time time-received");
                time_div.innerHTML = messages[i][0];
                
            //entry_div.appendChild(cb_div);
            
            chat_div.appendChild(sender_div);
            chat_div.appendChild(msg_div);
            chat_div.appendChild(time_div);
            
            mom.appendChild(chat_div);
                      
        }

}

function got_inbox()
{
    if(this.status==200)
    {
        var reply = JSON.parse(this.responseText);

        if(!reply.status)
        {
            display_info(reply.log);//
            return;
        }
        var mom = document.getElementById("message_div");
        mom.scrollTop = mom.scrollHeight;
        
        populate_messages(reply.messages);
                
    }
    else
    {
        display_info("relpy code: "+this.status);
        return;
    }

    
}

function get_inbox()
{
    send_request("POST",READ_INBOX_URL,got_inbox,{"id":ID});
}


function msg_sent()
{
    if(this.status==200)
    {
        var reply = JSON.parse(this.responseText);

        if(!reply.status)
        {
            display_info(reply.log);//
            return;
        }
        
        
        
        /* <div class = "chatbox outgoing">
            <div class="left-indent sender"> Me </div>
            <div class="left-indent"> really </div>
            <div class = "time time-sent">time sent </div>
        </div>
         */

        var chat_div= document.createElement("div");
                chat_div.setAttribute("class","chatbox outgoing");             
            
        var sender_div= document.createElement("div");
            sender_div.setAttribute("class","left-indent sender");
            sender_div.innerHTML = "Me"; 
        
        
        var msg_div= document.createElement("div");
            msg_div.setAttribute("class","left-indent");
            msg_div.innerHTML = CURRENT_MESSAGE;
        
        var date = new Date();
        
        var time_div= document.createElement("div");
            time_div.setAttribute("class","time time-sent");
            time_div.innerHTML = date.getHours()+":"+date.getMinutes();
            
        //entry_div.appendChild(cb_div);
        
        chat_div.appendChild(sender_div);
        chat_div.appendChild(msg_div);
        chat_div.appendChild(time_div);
        
        
        var mom = document.getElementById("message_div");
        mom.appendChild(chat_div);
        mom.scrollTop = mom.scrollHeight;
                
    }
    else
    {
        display_info("relpy code: "+this.status);
        return;
    }

}

function send_message()
{
        var users= document.getElementsByClassName("custom_checkbox");
        var selected_users =[];
        
        for(var counter=0; counter<users.length;counter++)
        {
            if(users[counter].innerHTML =="+")
                selected_users.push(users[counter].getAttribute("id"));
            
            }
        if (!selected_users.length)
        {
            display_info("Please Select User(s)");
            return ;
        }

        console.log(selected_users);
        
        var msg = document.getElementById("entry").value;
        
        CURRENT_MESSAGE =msg;
        
        send_request("post",POST_MESSAGE_URL,msg_sent,{"id":ID, "msg":msg,"recepients":selected_users});
        
        
        
        document.getElementById("user_list").style.display= "none";
        document.getElementById("entry").value= "";
        
}

function display_info(alert_msg)
{
    document.getElementById("info_text").innerHTML = alert_msg;
    document.getElementById("info").style.display="block";

}

window.onload = function()
{
/*    console.log( "page Loaded !!!");

    var incomings = document.getElementsByClassName("incoming");
    console.log(incomings[0].innerHTML);
    
    var divs =document.getElementsByTagName("div");
    console.log(divs);
 
    var el = document.getElementById("chat");
    console.log(el.innerHTML);
    el.innerHTML = " Chat";
    
    var div = document.createElement("div");
    div.innerHTML = "DYNAMICALLY CREATED CONTENT";
    
    var mom =document.getElementById("Mom");
    
    var br = document.createElement("br");
    mom.append(br);
    mom.appendChild(div);
    
    div.setAttribute("class","chatbox incoming")*/
    var log =console.log;
    
    log("hello there")
    
    
    fetch_users();
    
    //populate_messages([["8:15","daisy","hey There"],    ["8:20", "love", "i miss you"],  ["8:40","artht" ,"How is Your Intern"]]);
    
    document.getElementById("usernameEntry").addEventListener("keyup", function(e){
        console.log("...", e.key);
        console.log("...", e.keyCode);
        if (e.key=="Enter")
            login();
    });
    document.getElementById("entry").addEventListener("keyup",function(key_press){
        console.log("...", key_press.key);
        if(key_press.key=="Enter")
            display_users();
        
        });  
    document.getElementById("users").addEventListener("keyup",function(key_press){
        console.log("...", key_press.keyCode);
        console.log("...", key_press.key);
        if(key_press.key=="Escape")
            dismiss_userlist();
        
        });  
        document.getElementById("user_list").addEventListener("keyup",function(key_press){
        console.log("...", key_press.keyCode);
        console.log("...", key_press.key);
        if(key_press.key=="Escape")
            dismiss_userlist();
        
        });  
}

