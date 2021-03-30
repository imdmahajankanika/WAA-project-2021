// apikey from movieDB
const apiKey="7fa0c35103d70d16a05ec9db5b02bffa";
var movie_list = [];
// Default movie name
var movie="Thor";
console.log(movie);
var url= `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movie}`;
var credit_url;
var title, rel_date,image,id,director,actor,director_photo,actor_photo;
var list="";
var count=0;

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
          console.log(res);
          title=res["original_title"];
          rel_date=res["release_date"];
          id=res["id"];
          credit_url=`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`;
          if(res["poster_path"]==null){
            image='https://demofree.sirv.com/nope-not-here.jpg';
            list=`<li>  <strong> Movie Title: ${title} </strong> <a href=${image} target="_blank"><img src=${image}></a><br><br> <strong> Release Date: ${rel_date}</strong><br> <br></li>`;
          }
          else{
              image=`https://image.tmdb.org/t/p/w500${res["poster_path"]}`;
              list=`<li>  <strong> Movie Title: ${title} </strong> <a href=${image} target="_blank"><img src=${image}></a><br><br> <strong> Release Date: ${rel_date}</strong><br> <br></li>`;
          }
          document.getElementById("uList").innerHTML=list;
          movie_list.push(movie);
          // Append quiz form asking for actor/director name
          person_quiz_form(count);
          break;
        }
      }
    }
   else{
     list+=`<li> <p> <strong> No Result Found! </strong> </p> <br> </li>`;
      document.getElementById("uList").innerHTML=list;
    } 
  });
}

// if fetching the url results an error...
function onError(error){
  console.log("Error: "+error);
}

// Quiz form to recieve actor/director name
function person_quiz_form(count){
  //Create the element using the createElement method.
  var personDiv = document.createElement("div");
  //Set its unique ID.
  personDiv.id = `pid_${count}`;
  //Add your content to the DIV
  personDiv.innerHTML = `<form id="person_quizForm_${count}" name="person_quizForm_${count}" method="post">
        <div class="person_details" id="person_details">
          <p>Enter the director/actors of movie "${movie}" </p>
          <label for="name"><strong>Full name:</strong></label>
          <input type="text" id="name_${count}" name="name" placeholder="Director/Actor Full name" onfocus="this.value=''" required="required"><br><br>
          <button id="submit_${count}" type="button" onclick="doValidateNames(${count})">Submit</button><br>
          <p id="response_${count}"></p>
        </div>
      </form>
      <br>`;
  //Finally, append the element to the HTML body
  document.body.appendChild(personDiv);
  // Append div element to dispay name and image of crew/cast
  creditInfo(count);
  
  // Accept submission with the enter key
  var input = document.getElementById(`name_${count}`);
  input.addEventListener("keydown", function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      // On pressing enter, call the function to  validate the actor/director names
      doValidateNames(count);
    }
  });
}

//Button onclick event to validate the actor/director names
function doValidateNames(count){
  var name= (document.getElementById(`name_${count}`).value).trim();
  // Validate if name field is filled
  if(name){
    console.log("User entered '",name+"' for movie "+movie);
    url= `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movie}`;
    fetch(url).then(onResponse);
    function onResponse(response){
      response.json().then(function(result){
        var output= result.results;
        for(var res of output){
          if(res["original_title"].toLowerCase()==movie.toLowerCase()){
            //console.log(res);
            id=res["id"];
            credit_url=`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`;
            fetch(credit_url).then(onResult);
            break;
          }
        }
      });
    }
    function onResult(response){
      response.json().then(function(result){
        var entered_name=(name.toLowerCase()).trim()
        var flag=0;
        if(flag==0){
          var crew= result.crew;
          var cast = result.cast;
          var flag_director=0;
          var flag_actor=0;
          for(var res of crew){
            if(res["job"] == 'Director'){
              director=res["name"].toLowerCase()
              if(director==entered_name){
                flag_director=1;
                console.log("Director recognised!");
                document.getElementById(`response_${count}`).innerHTML=`<p style="color:Green;">"Correct!"</p> `;
                if (res["profile_path"] == null) {
                  // If there is no image url in movieDB api, then use custom image to display '404'
                  director_photo= `https://demofree.sirv.com/nope-not-here.jpg`;
                  document.getElementById(`credits_info_${count}`).innerHTML=`<strong> Director Name: ${res["name"]}</strong> <br>  <a href=${director_photo} target="_blank"><img src=${director_photo}></a> <br>`;
                }
                else{
                  director_photo= `https://image.tmdb.org/t/p/w500${res["profile_path"]}`
                  document.getElementById(`credits_info_${count}`).innerHTML=`<strong> Director Name: ${res["name"]}</strong> <br>  <a href=${director_photo} target="_blank"><img src=${director_photo}></a> <br>`;
                }
                document.getElementById(`name_${count}`).disabled = true;
                document.getElementById(`submit_${count}`).disabled = true;
                // Append movie quiz form on correct result
                movie_quiz_form(count);
                document.getElementById(`movie_name_${count}`).focus();
                break;
              } 
            }
          }
          if(!flag_director){
            flag=1;
            console.log("Director not found, searching for actor");
          }
        }  
        if(flag==1){
          for(var res of cast){
            actor=res["name"].toLowerCase();
            if(actor==entered_name){
              flag_actor=1;
              console.log("Actor Recognised!");
              document.getElementById(`response_${count}`).innerHTML=`<p style="color:Green;">"Correct!"</p> `;
              if (res["profile_path"] == null) {
                // If there is no image url in movieDB api, then use custom image to display '404'
                actor_photo= `https://demofree.sirv.com/nope-not-here.jpg`;
                document.getElementById(`credits_info_${count}`).innerHTML=`<strong> Actor Name: ${res["name"]}</strong> <br>  <a href=${actor_photo} target="_blank"><img src=${actor_photo}></a> <br>`;
              }
              else{
                actor_photo= `https://image.tmdb.org/t/p/w500${res["profile_path"]}`;
                document.getElementById(`credits_info_${count}`).innerHTML=`<strong> Actor Name: ${res["name"]}</strong> <br>  <a href=${actor_photo} target="_blank"><img src=${actor_photo}></a> <br>`;
              }  
              document.getElementById(`name_${count}`).disabled = true;
              document.getElementById(`submit_${count}`).disabled = true;
              // Append movie quiz form
              movie_quiz_form(count);
              document.getElementById(`movie_name_${count}`).focus();
              break;
            }
          }
          if(!(flag_actor)&&!(flag_director)){
            console.log("Both actor director not found");
            document.getElementById(`response_${count}`).innerHTML=`<p style="color:Red;">"Your answer is wrong!"</p>`;
            document.getElementById(`credits_info_${count}`).innerHTML="";
          }
        }
      })
    }
  }
  // If name field is empty, then push below alert
  else{
    alert('Please enter "Full name"!');
  }
}

// Function to display name and picture of director/actor
function creditInfo(count){
  //Create the element using the createElement method.
  var infoDiv = document.createElement("div");
  //Set its unique ID.
  infoDiv.id = `credits_info_${count}`;
  infoDiv.className = "credits_info"
  //Add your content to the DIV
  infoDiv.innerHTML = "";
  //Finally, append the element to the HTML body
  document.body.appendChild(infoDiv);
}

// Function to ask user for movie name
function movie_quiz_form(count){
  //Create the element using the createElement method.
  var movieDiv = document.createElement("div");
  //Set its unique ID.
  movieDiv.id = `mid_${count}`;
  //Add your content to the DIV
  movieDiv.innerHTML = `<br><form id="movie_quizForm_${count}" method="post">
    <div class="movie_details" id="movie_details">
      <p>Enter the name of a movie where the above person was actor/director </p>
      <label for="movie_name"><strong>Movie name:</strong></label>
      <input type="text" id="movie_name_${count}" name="movie_name" placeholder="Movie name" onfocus="this.value=''" required="required"><br><br>
      <button id="submit_movie_${count}" type="button" onclick="validate_movie(${count})">Submit</button><br>
      <p id="movie_response_${count}"></p>
    </div>
  </form>`;
  //Finally, append the element to the HTML body
  document.body.appendChild(movieDiv);
  movie_details(count);
  var movie_input = document.getElementById(`movie_name_${count}`);
  movie_input.addEventListener("keydown", function(event) {
    if (event.keyCode == 13) {
    event.preventDefault();
    // On pressing enter, call below function
    validate_movie(count);
    }
  });
}

// Function to display movie details
function movie_details(count){
  //Create the element using the createElement method.
  var movieInfoDiv = document.createElement("div");
  //Set its unique ID.
  movieInfoDiv.id = `display_movie_${count}`;
  movieInfoDiv.className = "display_movie";
  //Add your content to the DIV
  movieInfoDiv.innerHTML = `<ul id="uList2_${count}" class="uList2"></ul>`;
  //Finally, append the element to the HTML body
  document.body.appendChild(movieInfoDiv);
  
}


// Button onclick event to validate the movie name where the person was director/actor
function validate_movie(count){
  var movie_name= (document.getElementById(`movie_name_${count}`).value).trim();
  console.log("List of movies already entered:",movie_list);
  var name= (document.getElementById(`name_${count}`).value).trim();
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
      alert('You have already entered '+movie_name+'\nPlease enter a different movie name!');
      document.getElementById(`movie_response_${count}`).innerHTML=`<p style="color:Red;">"You can't enter the same movie name twice!"</p>`;
    }
    else{
      console.log("Movie entered by user: "+movie_name+", where actor/director:",name);
      url= `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movie_name}`;
      fetch(url).then(onConnect);
      function onConnect(response){
        response.json().then(function(result){
          var output= result.results;
          if(output.length>0){
            var flag=0;
            for(var res of output){
              if((res["original_title"].toLowerCase()==movie_name.toLowerCase())){
                console.log((res["original_title"].toLowerCase()==movie_name.toLowerCase()))
                flag=1;
                id=res["id"];
                title=res["original_title"];
                rel_date=res["release_date"];
                credit_url=`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`;
                if(res["poster_path"]==null){
                  image=`https://demofree.sirv.com/nope-not-here.jpg`;
                  list=`<li>  <strong> Movie Title: ${title} </strong> <a href=${image} target="_blank"><img src=${image}></a><br><br> <strong> Release Date: ${rel_date}</strong><br> <br></li>`;
                }
                else{
                  image=`https://image.tmdb.org/t/p/w500${res["poster_path"]}`;
                  list=`<li>  <strong> Movie Title: ${title} </strong> <a href=${image} target="_blank"><img src=${image}></a><br><br> <strong> Release Date: ${rel_date}</strong><br> <br></li>`;
                }
                
                fetch(credit_url).then(onResult);
                break;
              }
            }
            if(flag==0){
              document.getElementById(`movie_response_${count}`).innerHTML=`<p style="color:Red;">"No results found!"</p>`;
            }
          }
          else{
            document.getElementById(`movie_response_${count}`).innerHTML=`<p style="color:Red;">"No results found!"</p>`;
          }
        });
      }

      function onResult(response){
        response.json().then(function(result){
          var entered_name=(name.toLowerCase()).trim();
          var flag_actor = 0;
          var flag_director = 0;
          var flag=0;
          var crew= result.crew;
          var cast= result.cast;
          if(flag==0){
            for(var res of crew){
              if(res["job"] == 'Director'){
                director=res["name"].toLowerCase()
                if(director==entered_name){
                  flag_director=1;
                  console.log("Director recognised!");
                  document.getElementById(`movie_response_${count}`).innerHTML=`<p style="color:Green;">"Correct!"</p>`;
                  document.getElementById(`uList2_${count}`).innerHTML=list;
                  movie=document.getElementById(`movie_name_${count}`).value;
                  movie_list.push(movie);
                  document.getElementById(`submit_movie_${count}`).disabled = true;
                  document.getElementById(`movie_name_${count}`).disabled = true;
                  count+=1;
                  // Append form to ask for director/actor name
                  person_quiz_form(count);
                  document.getElementById(`name_${count}`).focus();
                  break;
                }
              }
            }
            if(!flag_director){
              flag=1;
              console.log("Movie not matched for director, Actual director:", director);
              console.log("\nLooking for actor...");
              document.getElementById(`uList2_${count}`).innerHTML="";      
            }
          }
          if(flag==1){
            for(var res of cast){
              actor=res["name"].toLowerCase();
              if(actor==entered_name){
                flag_actor=1;
                console.log("Actor Recognised!");
                document.getElementById(`movie_response_${count}`).innerHTML=`<p style="color:Green;">"Correct!"</p>`;
                document.getElementById(`uList2_${count}`).innerHTML=list;
                movie=document.getElementById(`movie_name_${count}`).value;
                movie_list.push(movie);
                document.getElementById(`submit_movie_${count}`).disabled = true;
                document.getElementById(`movie_name_${count}`).disabled = true;
                count+=1;
                // Append quiz form to ask for crew/cast name
                person_quiz_form(count);
                document.getElementById(`name_${count}`).focus();
                break;
              }
            }
            if((!flag_director)&&!(flag_actor)){
              console.log("Movie not matched for actor/director");
              document.getElementById(`movie_response_${count}`).innerHTML=`<p style="color:Red;">"Your answer is wrong!"</p>`;
              document.getElementById(`uList2_${count}`).innerHTML="";
            }
          }
        });
      } 
    } 
  }
  else{
    alert('Please enter both movie name and director/actor name!');
  }
}