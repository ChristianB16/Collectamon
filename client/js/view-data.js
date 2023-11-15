var pokeUrl = "http://localhost:5000";

var jsonObject = [
  {"id":"","name": "Gengar & Mimikyu GX", "type": "Psychic", "ability": "N/A", "attack": "Poltergeist", "set": "Team Up", "setNumber": "53", "price": "$15"},
];

main();

function main() {
  console.log(jsonObject);
  retrieveData();
}

function retrieveData() {
  $.ajax({
    url: pokeUrl + '/get-records',
    type: 'get',
    success: function (response) {
      var data = JSON.parse(response);
      if (data.msg == "SUCCESS") {
        jsonObject = data.pokeData; 
        showTable();
        deleteBtnListeners();
      } else {
        console.log(data.msg);
      }
    },
    error: function (err) {
      console.log(err);
    }
  });
}

function deleteRecord(name) {
  console.log("Deleting record with name:", name);
  $.ajax({
    url: pokeUrl + '/delete-record/' + name,
    type: 'delete',
    success: function (response) {
      var data = JSON.parse(response);
      if (data.msg === "SUCCESS") {
        console.log("Record Deleted");
        retrieveData();
      } else {
        console.log(data.msg);
      }
    },
    error: function (err) {
      console.log(err);
    }
  });
}

function deleteBtnListeners() {
  $(".delete-btn").click(function () {
    var id = $(this).data("id");
    var name = jsonObject[id].name;
    deleteRecord(name);
  });
}

function showTable() {
  var htmlString = "";
  for (var i = 0; i < jsonObject.length; i++) {
    htmlString += "<tr>";
    htmlString += "<td>" + jsonObject[i].name + "</td>";
    htmlString += "<td>" + jsonObject[i].type + "</td>";
    htmlString += "<td>" + jsonObject[i].ability + "</td>";
    htmlString += "<td>" + jsonObject[i].attack + "</td>";
    htmlString += "<td>" + jsonObject[i].set + "</td>";
    htmlString += "<td>" + jsonObject[i].setNumber + "</td>";
    htmlString += "<td>" + jsonObject[i].price + "</td>";
    htmlString += "<td><button class='delete-btn' data-id='" + i + "'>Delete</button></td>";
    htmlString += "</tr>";
  }

  $("#cardTable").html(htmlString);
}

$("#refresh").click(function () {
  var newCard = {
    name: "New Card",
    type: "New Type",
    ability: "New Ability",
    attack: "New Attack",
    set: "New Set",
    setNumber: "54",
    price: "$10"
  };

  // Add the new card to the jsonObject
  jsonObject.push(newCard);

  // Update the server with the new data
  $.ajax({
    url: pokeUrl + '/write-record',
    type: 'post',
    data: { pokeData: jsonObject },
    success: function(response){
      var data = JSON.parse(response);
      if(data.msg === "SUCCESS"){
        console.log("Data Saved");
      } else {
        console.log(data.msg);
      }
    },
    error:function(err){
      console.log(err);
    }
  });

  // Update the table
  showTable();
});