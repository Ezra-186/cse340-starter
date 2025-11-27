"use strict"

// Load vehicles when the user picks a classification
const classificationList = document.querySelector("#classificationList")

if (classificationList) {
  classificationList.addEventListener("change", function () {
    const classificationId = classificationList.value
    if (!classificationId) return

    const url = "/inv/getInventory/" + classificationId

    fetch(url)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.json()
      })
      .then(function (data) {
        buildInventoryList(data)
      })
      .catch(function (error) {
        console.error("Error loading inventory:", error)
      })
  })
}

// Build the inventory table
function buildInventoryList(data) {
  const inventoryDisplay = document.querySelector("#inventoryDisplay")
  if (!inventoryDisplay) return

  let table = "<thead>"
  table += "<tr><th>Vehicle Name</th><th></th><th></th></tr>"
  table += "</thead><tbody>"

  data.forEach(function (vehicle) {
    const name = vehicle.inv_make + " " + vehicle.inv_model
    table += "<tr>"
    table += "<td>" + name + "</td>"
    table +=
      "<td><a href='/inv/edit/" +
      vehicle.inv_id +
      "' title='Click to update'>Modify</a></td>"
    table +=
      "<td><a href='/inv/delete/" +
      vehicle.inv_id +
      "' title='Click to delete'>Delete</a></td>"
    table += "</tr>"
  })

  table += "</tbody>"

  inventoryDisplay.innerHTML = table
}
