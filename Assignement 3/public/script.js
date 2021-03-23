// apikey from movieDB
const apiKey="7fa0c35103d70d16a05ec9db5b02bffa"
var movie_list=[]
var movie="Thor"
console.log(movie)
var url= `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movie}`;
var credit_url
var title, rel_date,image,id,director,actor,director_photo,actor_photo;
var list="";

//Default movie
addEventListener('load', () => {
fetch(url).then(onSuccess, onError);
})


function onSuccess(response){
  response.json().then(function(result){
    var output= result.results;
    if(output.length>0){
      for(var res of output){
        if(res["original_title"].toLowerCase()==movie.toLowerCase()){
          console.log(res)
          title=res["original_title"]
          rel_date=res["release_date"]
          id=res["id"]
          credit_url=`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`
          if(res["poster_path"]==null){
            image='https://demofree.sirv.com/nope-not-here.jpg'
            list=`<li>  <strong> Movie Title: ${title} </strong> <a href=${image}><img src=${image}></a><br><br> <strong> Release Date: ${rel_date}</strong><br> <br></li>`
          }
          else{
              image=`https://image.tmdb.org/t/p/w500${res["poster_path"]}`;
              list=`<li>  <strong> Movie Title: ${title} </strong> <a href=${image}><img src=${image}></a><br><br> <strong> Release Date: ${rel_date}</strong><br> <br></li>`
          }
          document.getElementById("uList").innerHTML=list 
          movie_list.push(movie)
          //console.log("List of movies already entered:",movie_list)
          break;
        }
    
      }
    }
   else{
     list+=`<li> <p> <strong> No Result Found! </strong> </p> <br> </li>`
      document.getElementById("uList").innerHTML=list
   } 
  });
}

function onError(error){
  console.log("Error: "+error);
}

// On change in radio buttons for director/actor, emptying the text fields
var rad = document.quizForm.credits;
for (var i = 0; i < rad.length; i++) {
    rad[i].addEventListener('change', function() {
      document.getElementById("msg").innerHTML=""
      document.getElementById("fname").value=""
      document.getElementById("lname").value=""
      document.getElementById("credits_info").innerHTML=""
    });
}


//Ask user to give director/actor full names and validate it
function doValidateNames(){
  var fname= (document.getElementById('fname').value).trim();
  var lname = document.getElementById('lname').value.trim();
  if(fname && lname){
    console.log("User entered '",fname+" " +lname+"' for movie "+movie)
    url= `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movie}`;
    fetch(url).then(onResponse);
    function onResponse(response){
      response.json().then(function(result){
        var output= result.results;
          for(var res of output){
            if(res["original_title"].toLowerCase()==movie.toLowerCase()){
              //console.log(res)
              id=res["id"]
              credit_url=`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`
              fetch(credit_url).then(onResult);
              break;
            }
        
          }
      });
    }
    function onResult(response){
      response.json().then(function(result){
        const rbs = document.querySelectorAll('input[name="credits"]');
        var entered_name=(fname.toLowerCase()+" "+lname.toLowerCase()).trim()
        if(rbs[0]["checked"]){
          console.log("Director:",rbs[0]["checked"])
          var output= result.crew;
          var flag=0
          for(var res of output){
            if(res["job"] == 'Director'){
              director=res["name"].toLowerCase()
              if(director==entered_name){
                flag=1
                console.log("Director recognised!")
                document.getElementById("msg").innerHTML=`<p style="color:Green;">"Correct!"</p> `
                if(res["profile_path"]==null){
                  director_photo= `https://demofree.sirv.com/nope-not-here.jpg`
                  document.getElementById("credits_info").innerHTML=`<strong> Director Name: ${res["name"]}</strong> <br>  <a href=${director_photo}><img src=${director_photo}></a>`
                }
                else{
                  director_photo= `https://image.tmdb.org/t/p/w500${res["profile_path"]}`
                  document.getElementById("credits_info").innerHTML=`<strong> Director Name: ${res["name"]}</strong> <br>  <a href=${director_photo}><img src=${director_photo}></a>`
                }
                
                document.getElementById("movie_form").style.visibility="visible"
                document.getElementById("movie").innerHTML="Enter  the name of a movie where the above person was director"
                break;
              }
              
            }
          }
          if(!flag){
            console.log("Correct result:", director)
            document.getElementById("msg").innerHTML=`<p style="color:Red;">"Your answer is wrong!"</p>`
            document.getElementById("credits_info").innerHTML=""
            //document.getElementById("movie_form").style.visibility="hidden"
            //document.getElementById("valid_movie").style.visibility="hidden"
          }
        }
        else{
          console.log("Actor:",rbs[1]["checked"])
          var output= result.cast;
          //console.log(output)
          var flag=0;
          for(var res of output){
           actor=res["name"].toLowerCase()
              if(actor==entered_name){
                flag=1;
                console.log("Actor Recognised!")
                document.getElementById("msg").innerHTML=`<p style="color:Green;">"Correct!"</p> `
                if(res["profile_path"]==null){
                  actor_photo= `https://demofree.sirv.com/nope-not-here.jpg`
                  document.getElementById("credits_info").innerHTML=`<strong> Actor Name: ${res["name"]}</strong> <br>  <a href=${actor_photo}><img src=${actor_photo}></a>`
                }
                else{
                  actor_photo= `https://image.tmdb.org/t/p/w500${res["profile_path"]}`
                  document.getElementById("credits_info").innerHTML=`<strong> Actor Name: ${res["name"]}</strong> <br>  <a href=${actor_photo}><img src=${actor_photo}></a>`
                }
                
                document.getElementById("movie_form").style.visibility="visible"
                document.getElementById("movie").innerHTML="Enter  the name of a movie where the above person was actor"
                break;
              }
          }
          if(!flag){
            document.getElementById("msg").innerHTML=`<p style="color:Red;">"Your answer is wrong!"</p>`
            document.getElementById("credits_info").innerHTML=""
            //document.getElementById("movie_form").style.visibility="hidden"
            //document.getElementById("valid_movie").style.visibility="hidden"
          }

        }
        

      })
    }
  }
  else{
    alert('Please fill both "First name" and "Last name" fields!')
  }
  
}

// Ask for movie name where the person was director/actor
function validate_movie(){
  var movie_name= (document.getElementById('movie_name').value).trim();
  console.log("List of movies already entered:",movie_list)
  var fname= (document.getElementById('fname').value).trim();
  var lname = (document.getElementById('lname').value).trim();
  if(movie_name&&fname&&lname){
    var flag=0;
    for(var i of movie_list){
      if(movie_name.toLowerCase()==i.toLowerCase()){
        flag=1;
        break;
      }
    }
    if(flag){
      alert('You have already entered '+movie_name+'\nPlease enter a different movie name!')
    }
    else{
      console.log("Movie entered by user: "+movie_name+", where actor/director:",fname,lname)
      url= `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movie_name}`;
      fetch(url).then(onConnect);
      function onConnect(response){
        response.json().then(function(result){
          var output= result.results;
          if(output.length>0){
            var flag=0
            for(var res of output){
              if((res["original_title"].toLowerCase()==movie_name.toLowerCase())){
                console.log((res["original_title"].toLowerCase()==movie_name.toLowerCase()))
                flag=1
                id=res["id"]
                title=res["original_title"]
                rel_date=res["release_date"]
                credit_url=`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`
                if(res["poster_path"]==null){
                    image=`https://demofree.sirv.com/nope-not-here.jpg`
                    list=`<li>  <strong> Movie Title: ${title} </strong> <a href=${image}><img src=${image}></a><br><br> <strong> Release Date: ${rel_date}</strong><br> <br></li>`
                }
                else{
                    image=`https://image.tmdb.org/t/p/w500${res["poster_path"]}`
                    list=`<li>  <strong> Movie Title: ${title} </strong> <a href=${image}><img src=${image}></a><br><br> <strong> Release Date: ${rel_date}</strong><br> <br></li>`
                }
                
                fetch(credit_url).then(onResult);
                break;
              }
            }
            document.getElementById("valid_movie").style.visibility="visible"
            if(flag==0){
              document.getElementById("new_msg").innerHTML=`<p style="color:Red;">"No results found!"</p>`
              document.getElementById("valid_movie").style.visibility="hidden"
            }
          }
          else{
            document.getElementById("new_msg").innerHTML=`<p style="color:Red;">"No results found!"</p>`
            document.getElementById("valid_movie").style.visibility="hidden"
          }
        });
      }

      function onResult(response){
        response.json().then(function(result){
          const rbs = document.querySelectorAll('input[name="credits"]');
          var entered_name=(fname.toLowerCase()+" "+lname.toLowerCase()).trim()
          if(rbs[0]["checked"]){
            console.log("Director:",rbs[0]["checked"])
            var output= result.crew;
            var flag=0
            for(var res of output){
              if(res["job"] == 'Director'){
                director=res["name"].toLowerCase()
                if(director==entered_name){
                  flag=1
                  console.log("Director recognised!")
                  document.getElementById("new_msg").innerHTML=`<p style="color:Green;">"Correct!"</p>`
                  document.getElementById("uList2").innerHTML=list
                  movie=document.getElementById('movie_name').value
                  movie_list.push(movie)
                  break;
                }
              }
            }
            if(!flag){
              console.log("Movie not matched for director, Actual director:", director)
              document.getElementById("new_msg").innerHTML=`<p style="color:Red;">"Your answer is wrong!"</p>` 
              document.getElementById("uList2").innerHTML=""               
            }
          }
          else{
            console.log("Actor:",rbs[1]["checked"])
            var output= result.cast;
            //console.log(output)
            var flag=0;
            for(var res of output){
            actor=res["name"].toLowerCase()
                if(actor==entered_name){
                  flag=1;
                  console.log("Actor Recognised!")
                  document.getElementById("new_msg").innerHTML=`<p style="color:Green;">"Correct!"</p>`
                  document.getElementById("uList2").innerHTML=list
                  movie=document.getElementById('movie_name').value
                  movie_list.push(movie)
                  break;
                }
            }
            if(!flag){
              document.getElementById("new_msg").innerHTML=`<p style="color:Red;">"Your answer is wrong!"</p>`
              document.getElementById("uList2").innerHTML=""               
            }
          }
        })
      }
      
    } 
  }
  else{
    alert('Please enter both movie name and director/actor name!')
  }
}