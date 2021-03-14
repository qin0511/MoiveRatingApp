//get movie name from url

const addcomments = async (movie_name) => {
  const comments = document.getElementById("commentsid").value;
  console.log("comments in froneend :" + comments);
  const res = await fetch("http://localhost:3000/addcomment/" + movie_name, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ movie_name: movie_name, comments: comments }),
  }).then((res) => {
    location.reload();
  });
};

const fetchcomments = async (movie_name) => {
  const res = await fetch("/fetchcomment/" + movie_name);
  const data = await res.json();
  console.log(data);
  const scomments = JSON.stringify(data);
  let idx;
  const obj = JSON.parse(scomments);
  let comments = "";
  for (idx = 0; idx < obj.length; ++idx) {
    if (obj[idx].hasOwnProperty("comments")) {
      comments = obj[idx]["comments"];
    }
    document.getElementById("allcomment").innerHTML += "<br>" + comments;
  }
};

const changeMovieTitle = (movie_name) => {
  document.getElementById("movieTitle").innerHTML = movie_name;
};

const changeMoviePoster = (movie_name) => {
  if (movie_name == "DARK") {
    imgLocation = "../images/1.png";
  } else if (movie_name == "BENNY LOVES YOU") {
    imgLocation = "../images/2.png";
  } else if (movie_name == "BREAKING BAD") {
    imgLocation = "../images/3.png";
  } else if (movie_name == "WESTWORLD") {
    imgLocation = "../images/4.png";
  } else if (movie_name == "NOMADLAND") {
    imgLocation = "../images/5.png";
  } else if (movie_name == "SOUL") {
    imgLocation = "../images/6.png";
  } else {
    imgLocation = "../images/default.png";
  }
  const image = document.getElementById("movieimage");
  image.src = imgLocation;
};

const changeMovieDescriptions = async (movie_name) => {
  const res = await fetch("/fetchdescription/" + movie_name);
  const data = await res.json();
  console.log(data);
  const sdescriptions = JSON.stringify(data);
  let idx;
  const obj = JSON.parse(sdescriptions);
  console.log(obj);

  const introduction = obj["introduction"] ? obj["introduction"] : "N/A";
  document.getElementById("introduction").innerHTML = introduction;
  const director = obj["director"] ? obj["director"] : "N/A";
  document.getElementById("director").innerHTML = director;
  const starring = obj["starring"] ? obj["starring"] : "N/A";
  document.getElementById("starring").innerHTML = starring;
  const year = obj["year"];
  document.getElementById("year").innerHTML = year;
  const rate = obj["rate"];
  document.getElementById("rate").innerHTML = rate;
};

const GetRequest = () => {
  let url = window.location.href;
  console.log(url);
  let vars = url.split("/");
  let name = vars.pop();
  console.log(name);
  let movie_name_s = name.split("%20");
  let movie_name_j = movie_name_s.join(" ");
  console.log(movie_name_j);
  return movie_name_j;
};

const movie_name = GetRequest();

console.log(movie_name);

fetchcomments(movie_name);
changeMovieTitle(movie_name);
changeMoviePoster(movie_name);
changeMovieDescriptions(movie_name);

const thisForm = document.getElementById("myForm");
console.log(thisForm);
thisForm.addEventListener("submit", (e) => {
  addcomments(movie_name);
  e.preventDefault();
});
