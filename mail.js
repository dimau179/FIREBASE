const firebaseConfig = {
  //   copy your firebase config informations
  apiKey: "AIzaSyAX1lShikmYRZvHcJZZE2yd0Lr9Mvb3FfQ",
  authDomain: "app-2022-1.firebaseapp.com",
  databaseURL: "https://app-2022-1-default-rtdb.firebaseio.com",
  projectId: "app-2022-1",
  storageBucket: "app-2022-1.appspot.com",
  messagingSenderId: "622867402582",
  appId: "1:622867402582:web:5bfd0143dd6368ef22d0f7"
};

// initialize firebase
firebase.initializeApp(firebaseConfig);

// reference your database

var noalarmas = firebase.database().ref("/Test");
var sendDB = firebase.database().ref("/Test");
var dateformDB = firebase.database().ref("control_form/Alarma_"+String(alarm));
var datesDB = firebase.database().ref("control_form/Alarma_"+String(alarm));
var timesDB = firebase.database().ref("control_form/Alarma_"+String(alarm));
var formDB = firebase.database().ref("control_form");

var niveld = 0;
var alarm = 0;
var servo = 0;
var distancia = 1;
var dates_programadas= ["--","--","--","--","--"];
var times_programadas= ["--","--","--","--","--"];
var fecha = new Date();
var daynow= fecha.getDate();
var yearnow= fecha.getFullYear();
var monthnow= fecha.getMonth()+1;
var hournow= fecha.getHours();
var minutesnow= fecha.getMinutes();
var secondsnow= fecha.getSeconds();
var idhournow;
var ampm = "";
var text1;
var text2;


var datealarm = {alarma_1:"",alarma_2:"", alarma_3:"", alarma_4:"",alarma_5:""  };
var timealarm = {alarma_1:"",alarma_2:"", alarma_3:"", alarma_4:"",alarma_5:""  };



update();
var intervalo = setInterval(update,1000);

updatedate();
var intervalo1 = setInterval(updatedate,1000);

nivel();
var intervalo2 = setInterval(nivel,1000);


function update () {
  noalarmas.on('value', (snapshot) => {
    test = snapshot.val();
    dateformDB = firebase.database().ref("control_form/Alarma_"+String(test.alarm));
    alarm = test.alarm;
    servo = test.servo;
    distancia = test.distancia;
  });

  for (let i = 0; (i) < alarm; i++) {
    datesDB= firebase.database().ref("control_form/Alarma_"+String(i)+"/date");
    datesDB.on('value', (snapshot) => {
      dates_programadas[i] = String(snapshot.val());
    });
  
    timesDB= firebase.database().ref("control_form/Alarma_"+String(i)+"/time");
    timesDB.on('value', (snapshot) => {
      times_programadas[i] = String(snapshot.val());
    });
  }

  for(i in times_programadas){
    if (dates_programadas[i]+times_programadas[i]+":00"==text1+text2 ) {
      servo = 1;
      sendalarm(alarm, servo, distancia);
    }
  }
}



var saveb= document.getElementById("save1");
saveb.addEventListener("click", submitForm);
var setb= document.getElementById("setclear");
setb.addEventListener("click", setclear );
var dropb= document.getElementById("suministrar")
dropb.addEventListener("click", sumi );

function setclear(e){
  e.preventDefault();
  alarm = 0;
  dates_programadas= ["--","--","--","--","--"];
  sendalarm(alarm, servo, distancia);
  
}
function sumi(e){
  e.preventDefault();
  servo = 1;
  sendalarm(alarm, servo, distancia);
}

function submitForm(e) {
  e.preventDefault();

  var date = getElementVal("date");
  var time = getElementVal("time1");
  
  alarm++;
  savedate(date, time);
  sendalarm(alarm, servo, distancia);

  dateformDB = firebase.database().ref("control_form/Alarma_"+String(alarm));

  //   enable alert
  document.querySelector(".alert").style.display = "block";

  //   remove the alert
  setTimeout(() => {
    document.querySelector(".alert").style.display = "none";
  }, 3000);

  //   reset the form
  document.getElementById("control_form").reset();
}

const savedate = (date, time)=> {
  
  dateformDB.set({
    date: date,
    time: time 
  });
};

const sendalarm = (alarm, servo, distancia)=>{
  sendDB.set({
    alarm: alarm,
    servo: servo,
    distancia: distancia,
  });
}

const getElementVal = (id) => {
  return document.getElementById(id).value;
};

function nivel(){
  niveld = (20.5-distancia)/20.5;
  niveld = Math.trunc(niveld*100);
}

function updatedate(){
  fecha = new Date();
  daynow= fecha.getDate();
  yearnow= fecha.getFullYear();
  monthnow= fecha.getMonth()+1;
  hournow= fecha.getHours();
  minutesnow= fecha.getMinutes();
  secondsnow= fecha.getSeconds();
  fecha_actual= [String(yearnow), String(daynow), String(monthnow), String(hournow), String(minutesnow), String(secondsnow)]
  
  for (let x in fecha_actual) {
    if (fecha_actual[x].length==1) {
      fecha_actual[x]=fecha_actual[x].replace(fecha_actual[x],"0"+fecha_actual[x]);
    }
  }
  
  if(Number(fecha_actual[3]) >= 12){
    idhournow =  String(Number(fecha_actual[3]- 12));
    ampm = 'PM';
  }else{
    idhournow =  String(Number(fecha_actual[3]));
    ampm = 'AM';
  }
  
  if(idhournow == "0"){
    idhournow = 12;
  };
  hnivel = document.getElementById("nivel");
  hdaynow = document.getElementById("daynow");
  hyearnow = document.getElementById("yearnow");
  hmonthnow = document.getElementById("monthnow");
  hhournow = document.getElementById("hournow");
  hminutesnow = document.getElementById("minutesnow");
  hsecondsnow = document.getElementById("secondsnow")
  hampm = document.getElementById("ampm")
  
  hyearnow.textContent = fecha_actual[0];
  hdaynow.textContent = fecha_actual[1];
  hmonthnow.textContent = fecha_actual[2];
  hhournow.textContent = idhournow;
  hminutesnow.textContent = fecha_actual[4];
  hsecondsnow.textContent = fecha_actual[5];
  hampm.textContent=ampm;
  hnivel = niveld;
  text1 = `${fecha_actual[0]}-${fecha_actual[2]}-${fecha_actual[1]}`;
  text2 = `${fecha_actual[3]}:${fecha_actual[4]}:${fecha_actual[5]}`;
  
  datealarm = {alarma_1: dates_programadas[0], alarma_2: dates_programadas[1], alarma_3:dates_programadas[2], alarma_4:dates_programadas[3], alarma_5:dates_programadas[4] };  
  timealarm = {alarma_1: times_programadas [0], alarma_2: times_programadas[1] , alarma_3:times_programadas[2], alarma_4:times_programadas[3], alarma_5:times_programadas[4]  };
  newformtime = ["--", "--", "--", "--", "--"];
  jornadaalarm = ["--", "--", "--", "--", "--"];
  for(let x=0;(x)<alarm; x++){
    if( Number(times_programadas[x].slice(0,2)) >= 12){
      newformtime[x] =  String(Number(times_programadas[x].slice(0,2))- 12);
      newformtime[x] =  newformtime[x].concat("",times_programadas[x].slice(2,5));
      jornadaalarm[x] = 'PM';
    }else{
      newformtime[x] =  times_programadas[x];
      jornadaalarm[x]= 'AM';
      if(newformtime[x].slice(0,1) =="0"){
        newformtime[x] = newformtime[x].slice(1,5)
      }
    }
  }

  if (datealarm.alarma_1 === undefined)  {
    document.getElementById("datealarm1").innerHTML = "--";
  } else if (typeof datealarm.alarma_1 == "strng"){
    document.getElementById("datealarm1").innerHTML = "--";
  }else{
    document.getElementById("datealarm1").innerHTML = datealarm.alarma_1;
  }
  
  if (datealarm.alarma_2 === undefined)  {
    document.getElementById("datealarm2").innerHTML = "--";
  } else if (datealarm.alarma_2 === null){
    document.getElementById("datealarm2").innerHTML = "--";
  }else{
    document.getElementById("datealarm2").innerHTML = datealarm.alarma_2;
  }
  if (datealarm.alarma_3 === undefined)  {
    document.getElementById("datealarm3").innerHTML = "--";
  } else if (datealarm.alarma_3 === null){
    document.getElementById("datealarm3").innerHTML = "--";
  }else{
    document.getElementById("datealarm3").innerHTML = datealarm.alarma_3;
  }
  if (datealarm.alarma_4 === undefined)  {
    document.getElementById("datealarm4").innerHTML = "--";
  } else if (datealarm.alarma_4 === null){
    document.getElementById("datealarm4").innerHTML = "--";
  }else{
    document.getElementById("datealarm4").innerHTML = datealarm.alarma_4;
  }
  if (datealarm.alarma_5 === undefined)  {
    document.getElementById("datealarm5").innerHTML = "--";
  } else if (datealarm.alarma_5 === null){
    document.getElementById("datealarm5").innerHTML = "--";
  }else{
    document.getElementById("datealarm5").innerHTML = datealarm.alarma_5;
  }
  document.getElementById("nivel").innerHTML = niveld;
  document.getElementById("timealarm1").innerHTML = newformtime[0];
  document.getElementById("timealarm1").innerHTML = newformtime[0];
  document.getElementById("timealarm2").innerHTML = newformtime[1];
  document.getElementById("timealarm3").innerHTML = newformtime[2];
  document.getElementById("timealarm4").innerHTML = newformtime[3];
  document.getElementById("timealarm5").innerHTML = newformtime[4];
  document.getElementById("ampmalarm1").innerHTML = jornadaalarm[0];
  document.getElementById("ampmalarm2").innerHTML = jornadaalarm[1];
  document.getElementById("ampmalarm3").innerHTML = jornadaalarm[2];
  document.getElementById("ampmalarm4").innerHTML = jornadaalarm[3];
  document.getElementById("ampmalarm5").innerHTML = jornadaalarm[4];

}




