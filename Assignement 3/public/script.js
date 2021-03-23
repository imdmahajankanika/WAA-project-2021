// apikey from movieDB
const apiKey="7fa0c35103d70d16a05ec9db5b02bffa"
var movie_list = []
// Default movie name
var movie="Thor"
console.log(movie)
var url= `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movie}`;
var credit_url
var title, rel_date,image,id,director,actor,director_photo,actor_photo;
var list="";

//show default movie on loading the page
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
// if fetching the url results an error...
function onError(error){
  console.log("Error: "+error);
}

// On change in radio buttons for director/actor, emptying the text fields for name, clearing the message and hiding the div element show actor/director info...
var rad = document.quizForm.credits;
for (var i = 0; i < rad.length; i++) {
    rad[i].addEventListener('change', function() {
      document.getElementById("msg").innerHTML=""
      document.getElementById("name").value=""
      document.getElementById("credits_info").innerHTML=""
    });
}


//Button onclick event to validate the actor/director names
function doValidateNames(){
  var name= (document.getElementById('name').value).trim();
    // Validate if name field is filled
  if(name){
    console.log("User entered '",name+"' for movie "+movie)
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
        var entered_name=(name.toLowerCase()).trim()
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
                  if (res["profile_path"] == null) {
                    // If there is no image url in movieDB api, then use custom image to display '404'
                  director_photo= `https://demofree.sirv.com/nope-not-here.jpg`
                  document.getElementById("credits_info").innerHTML=`<strong> Director Name: ${res["name"]}</strong> <br>  <a href=${director_photo}><img src=${director_photo}></a>`
                }
                else{
                  director_photo= `https://image.tmdb.org/t/p/w500${res["profile_path"]}`
                  document.getElementById("credits_info").innerHTML=`<strong> Director Name: ${res["name"]}</strong> <br>  <a href=${director_photo}><img src=${director_photo}></a>`
                }
                
                document.getElementById("movie_form").style.visibility="visible"
                  document.getElementById("movie").innerHTML = "Enter  the name of a movie where the above person was director"
                  document.getElementById('director').disabled = true;
                  document.getElementById('actor').disabled = true;
                  document.getElementById('name').disabled = true;
                  document.getElementById('submit').disabled = true;
                  document.getElementById('submit_movie').disabled = false;
                  document.getElementById('movie_name').disabled = false;
                  document.getElementById("movie_name").focus();
                  document.getElementById('new_msg').innerHTML = "";
                  document.getElementById("valid_movie").style.visibility = "hidden"
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
                  if (res["profile_path"] == null) {
                    // If there is no image url in movieDB api, then use custom image to display '404'
                  actor_photo= `https://demofree.sirv.com/nope-not-here.jpg`
                  document.getElementById("credits_info").innerHTML=`<strong> Actor Name: ${res["name"]}</strong> <br>  <a href=${actor_photo}><img src=${actor_photo}></a>`
                }
                else{
                  actor_photo= `https://image.tmdb.org/t/p/w500${res["profile_path"]}`
                  document.getElementById("credits_info").innerHTML=`<strong> Actor Name: ${res["name"]}</strong> <br>  <a href=${actor_photo}><img src=${actor_photo}></a>`
                }
                
                document.getElementById("movie_form").style.visibility="visible"
                  document.getElementById("movie").innerHTML = "Enter  the name of a movie where the above person was actor"
                  document.getElementById('director').disabled = true;
                  document.getElementById('actor').disabled = true;
                  document.getElementById('name').disabled = true;
                  document.getElementById('submit').disabled = true;
                  document.getElementById('submit_movie').disabled = false;
                  document.getElementById('movie_name').disabled = false;
                  document.getElementById("movie_name").focus();
                  document.getElementById('new_msg').innerHTML = "";
                  document.getElementById("valid_movie").style.visibility = "hidden"
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
   // If either of first name or last name field is empty, then push below alert
  else{
    alert('Please fill both "First name" and "Last name" fields!')
  }
  
}


// Button onclick event to validate the movie name where the person was director/actor
function validate_movie(){
  var movie_name= (document.getElementById('movie_name').value).trim();
  console.log("List of movies already entered:",movie_list)
  var name= (document.getElementById('name').value).trim();
    // Validate if user has filled movie name field
  if(movie_name&&name){
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
      console.log("Movie entered by user: "+movie_name+", where actor/director:",name)
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
          var entered_name=(name.toLowerCase()).trim()
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
                    document.getElementById('submit_movie').disabled = true;
                    document.getElementById('movie_name').disabled = true;
                    document.getElementById('director').disabled = false;
                    document.getElementById('actor').disabled = false;
                    document.getElementById('name').disabled = false;
                    document.getElementById('submit').disabled = false;
                    document.getElementById('msg').innerHTML = "";
                    document.getElementById("name").focus();
                    document.getElementById("credits_info").innerHTML = ""
                    document.getElementById("credit").innerHTML = `Enter the director/actor of movie "${movie}"`
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
                    document.getElementById('submit_movie').disabled = true;
                    document.getElementById('movie_name').disabled = true;
                    document.getElementById('director').disabled = false;
                    document.getElementById('actor').disabled = false;
                    document.getElementById('name').disabled = false;
                    document.getElementById('submit').disabled = false;
                    document.getElementById('msg').innerHTML = "";
                    document.getElementById("name").focus();
                    document.getElementById("credits_info").innerHTML = ""
                    document.getElementById("credit").innerHTML = `Enter the director/actor of movie "${movie}"`
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