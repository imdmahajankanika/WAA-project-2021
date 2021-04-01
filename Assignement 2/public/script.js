var figs = []
var username = ''
var figure_size = document.getElementById("figureSize");
const canvas = document.querySelector('#myCanvas')
canvas.width = document.getElementById("drawingbox").clientWidth;
canvas.height = document.getElementById("drawingbox").clientHeight;
var shape = document.getElementById("shapes");
var bg_color = document.getElementById("bgcolor");
var border_col = document.getElementById("bordercolor");
var border_thickness = document.getElementById("borderThickness");

var socket = io();

const ctx = canvas.getContext('2d')
addEventListener('load', () => {
  document.getElementById('draw').disabled = true;
  let input = document.getElementById('username')
  input.value = ''
})
addEventListener('resize', () => {
  canvas.width = document.getElementById("drawingbox").clientWidth;
  canvas.height = document.getElementById("drawingbox").clientHeight;
})

// Accept submission with the enter key
document.getElementById('username').addEventListener("keydown", function(event) {
  if (event.keyCode == 13) {
    event.preventDefault();
    // On pressing enter, call the function to  validate the actor/director names
    registerUser();
  }
});

function registerUser() {
  let input = document.getElementById('username')
  let draw_btn = document.getElementById('draw')
  let user_message = document.getElementById('user_message')
  let save_btn = document.getElementById('save_image')
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (input.value.length >= 6) {

    //Unlock draw button
    if (draw_btn.disabled == true) {
      draw_btn.disabled = false
    }

    if (save_btn.disabled == true) {
      save_btn.disabled = false
    }
    username = input.value
    user_message.innerHTML = `You are now logged in as : <b>${username}</b>`

  }
  else {
    if (draw_btn.disabled == false) { draw_btn.disabled = true }
    if (save_btn.disabled == false) { save_btn.disabled = true }
    username = input.value
    user_message.innerHTML = `username didn't match length criteria! Please register with username length >= 6`

  }
}



function draw() {
  let shape = document.getElementById('shapes').value
  if (shape == 'Triangle') {
    drawTriangle()
  }
  else if (shape == 'Square') {
    drawSquare()
  }
  else if (shape == 'Circle') {
    drawCircle()
  }

}

function drawTriangle(figSize = parseInt(document.getElementById('figureSize').value), borderSize = parseInt(document.getElementById('borderThickness').value), start = getStartingPoint(figSize, borderSize), border_color = document.getElementById('bordercolor').value, background_color = document.getElementById('bgcolor').value, new_fig = true) {

  ctx.beginPath();
  ctx.fillStyle = background_color;
  ctx.moveTo(start[0] - figSize / 2, start[1] - figSize / 2);
  ctx.lineTo(start[0] - figSize / 2, start[1] + figSize / 2);
  ctx.lineTo(start[0] + figSize / 2, start[1] + figSize / 2);
  ctx.closePath();
  ctx.lineWidth = borderSize;
  ctx.fill();
  ctx.strokeStyle = border_color;
  ctx.stroke();

  let triangle = {
    user: username,
    shape: 'Triangle',
    figSize: figSize,
    borderSize: borderSize,
    start: getStartingPoint(figSize, borderSize),
    borderColor: border_color,
    backgroundColor: background_color
  }
  if (new_fig) {
    sendData(triangle)
  }
}

function drawSquare(figSize = parseInt(document.getElementById('figureSize').value), borderSize = parseInt(document.getElementById('borderThickness').value), start = getStartingPoint(figSize, borderSize), border_color = document.getElementById('bordercolor').value, background_color = document.getElementById('bgcolor').value, new_fig = true) {

  var width = figSize;
  ctx.fillStyle = background_color;
  ctx.fillRect(start[0], start[1], width, width);
  ctx.strokeStyle = border_color;
  ctx.lineWidth = borderSize;
  ctx.strokeRect(start[0], start[1], width, width);
  let square = {
    user: username,
    shape: 'Square',
    figSize: figSize,
    borderSize: borderSize,
    start: getStartingPoint(figSize, borderSize),
    borderColor: border_color,
    backgroundColor: background_color
  }
  if (new_fig) {
    sendData(square)
  }
}

function drawCircle(figSize = parseInt(document.getElementById('figureSize').value), borderSize = parseInt(document.getElementById('borderThickness').value), start = getStartingPoint(figSize, borderSize), border_color = document.getElementById('bordercolor').value, background_color = document.getElementById('bgcolor').value, new_fig = true) {

  var r = figSize / 2;
  ctx.beginPath();
  ctx.arc(start[0], start[1], r, 0, 2 * Math.PI);
  ctx.fillStyle = background_color;
  ctx.fill();
  ctx.lineWidth = borderSize;
  ctx.strokeStyle = border_color;
  ctx.stroke();

  let circle = {
    user: username,
    shape: 'Circle',
    figSize: figSize,
    borderSize: borderSize,
    start: getStartingPoint(figSize, borderSize),
    borderColor: border_color,
    backgroundColor: background_color
  }
  if (new_fig) {
    sendData(circle)
  }

}

function getStartingPoint(figSize, borderSize) {
  //let x = (Math.random()*(innerWidth - figSize - borderSize)) + borderSize
  //let y = (Math.random()*(innerHeight - figSize - borderSize)) + borderSize
  var x = Math.floor(Math.random() * (canvas.width));
  var y = Math.round(Math.random() * (canvas.height));
  return [x, y]
}

let isDrawing = false;
let x = 0;
let y = 0;


function drawLine(x1, y1, x2, y2, pencil_col = document.getElementById('pencilCol').value, pencil_size = document.getElementById('pencil_size').value) {
  // using a line between actual point and the last one solves the problem
  // if you make very fast circles, you will see polygons.
  // we could make arcs instead of lines to smooth the angles and solve the problem
  ctx.beginPath();
  ctx.strokeStyle = pencil_col;
  ctx.lineWidth = pencil_size;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
}

function drawCircleAtCursor(x, y, canvas, event) {
  // Problem with draw circle is the refresh rate of the mousevent.
  // if you move too fast, circles are not connected.
  // this is browser dependant, and can't be modified.
  ctx.beginPath()
  ctx.arc(x, y, 10 / 2, 0, Math.PI * 2)
  ctx.closePath()

  ctx.lineWidth = 2
  ctx.strokeStyle = "#000"
  ctx.stroke()

  ctx.fillStyle = "#000"
  ctx.fill()
}

canvas.addEventListener('mousedown', function (e) {
  if (username != '') {
    const rect = canvas.getBoundingClientRect()
    x = e.clientX - rect.left
    y = e.clientY - rect.top
    console.log("x: " + x + " y: " + y)
    let Last_User = document.getElementById('Last_User')
    Last_User.innerHTML = `Last user: <b>YOU</b>`
    isDrawing = true
  }
  else {
    let user_message = document.getElementById('user_message')
    user_message.innerHTML = `Not registered! Please register to use canvas`
  }
})

canvas.addEventListener('mousemove', e => {
  if (isDrawing === true) {
    //drawCircleAtCursor(x,y,canvas, e)
    drawLine(x, y, e.offsetX, e.offsetY);
    let pencil_col = document.getElementById('pencilCol').value;
    let pencil_size = document.getElementById('pencil_size').value;
    sendLine({ user: username, x: x, y: y, x2: e.offsetX, y2: e.offsetY, pencil_color: pencil_col, pencil_size: pencil_size })
    x = e.offsetX;
    y = e.offsetY;
  }
});

window.addEventListener('mouseup', e => {
  if (isDrawing === true) {
    //drawCircleAtCursor(x,y,canvas, e)
    drawLine(x, y, e.offsetX, e.offsetY);
    x = 0;
    y = 0;
    isDrawing = false;
  }
});


function sendData(data) {
  socket.emit('send figure', data);
}

function sendLine(data) {
  socket.emit('send Line', data);
}
socket.on('share figure', (figure) => {
  if (figure.shape == 'Triangle') {
    drawTriangle(figure.figSize, figure.borderSize, figure.start, figure.borderColor, figure.backgroundColor, false)
  }
  else if (figure.shape == 'Square') {
    drawSquare(figure.figSize, figure.borderSize, figure.start, figure.borderColor, figure.backgroundColor, false)
  }
  else if (figure.shape == 'Circle') {
    drawCircle(figure.figSize, figure.borderSize, figure.start, figure.borderColor, figure.backgroundColor, false)
  }

})

socket.on('share Line', (line) => {
  let Last_User = document.getElementById('Last_User')
  Last_User.innerHTML = `Last user: <b>${line.user}</b>`
  drawLine(line.x, line.y, line.x2, line.y2, line.pencil_color, line.pencil_size)
})

function save_image() {
  var url = canvas.toDataURL("image/png")
  let now = new Date();
  let ts = (now.getDate()) + '.' + (now.getMonth() + 1) + '.' + now.getFullYear() + "_" + now.getHours() + '.'
    + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + '.' + ((now.getSeconds() < 10) ? ("0" + now
      .getSeconds()) : (now.getSeconds()))

  let formData = new FormData()
  formData.append('username', username);
  formData.append('image', url)
  formData.append('timestamp', ts)
  fetch('/upload', {
    method: 'POST',
    body: formData
  })
  alert(`Success! \n\nUser '${username}' saved the image!`);
}

function saved_images() {
  // Open new page
  var newWin = window.open("#saved_images", target = "_blank");
  var count = 0;
  fetch("/display")
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      for (var { username, datetime, imgPath } of json) {
        console.log(`username : ${username}\ndatetime: ${datetime}\nimgPath:${imgPath}`)
        var relativePath = imgPath.split("public")[1].replace(/[\\]/g, "/");
        console.log("Relative Path",relativePath)
        var img_div = document.createElement("div");
        img_div.id = `uid_${count}`;
        img_div.innerHTML = ` <ul id="uList_${count}" class="uList" style="list-style-type: none; text-align:left; display: inline-block; margin: 5px 0px; padding: 10px;background: #f9f9f9;border: 1px solid #dadada;"><li>  <strong> Username: ${username} </strong> <br><br> <strong> Image Url: </strong> <a href="${relativePath}" target="_blank">Link</a><br><br> <strong> DateTime: ${datetime}</strong><br> <br></li><ul>`;
        // Append the saved images data on new page
        newWin.document.write(img_div.innerHTML);
        count += 1;
      }
        newWin.document.close();
    }, function onError(error) {
      //console.log("Error: "+error);
      newWin.document.write(`<h2>Image not found in DB!</h2><p>Draw something on canvas and save the image!</p>`);
      newWin.document.close();
    }
    );


}

