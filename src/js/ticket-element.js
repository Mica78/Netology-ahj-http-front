const pencil = require("../img/pencil-striped-symbol-for-interface-edit-buttons_icon-icons.com_56782.png");
const del = require("../img/1485477104-basket_78591.png");

class TicketElement {
  constructor(element, data) {
    if (typeof element === "string") {
      this.element = document.querySelector(element);
    } else {
      this.element = element;
    }

    this.updateTicketElementData(data);
  }

  createTicketElement() {
    this.ticketElement = document.createElement("div");
    this.ticketElement.classList.add("ticket");
    const text = document.createElement("div");
    text.classList.add("text");
    this.nameElement = document.createElement("p");
    this.nameElement.classList.add("ticket-name");
    this.nameElement.textContent = this.name;
    text.insertAdjacentElement("beforeend", this.nameElement);
    this.radioElement = document.createElement("input");
    this.radioElement.type = "radio";
    this.radioElement.classList.add("ticket-status");
    this.radioElement.checked = this.status;
    this.nameElement.insertAdjacentElement("beforebegin", this.radioElement);
    if (this.description) {
      const descriptionElement = document.createElement("p");
      descriptionElement.textContent = this.description;
      text.insertAdjacentElement("beforeend", descriptionElement);
    }
    this.buttons = document.createElement("div");
    this.buttons.classList.add("buttons");
    this.deleteBtn = document.createElement("img");
    this.deleteBtn.src = del;
    this.deleteBtn.classList.add("delete-button");
    this.editBtn = document.createElement("img");
    this.editBtn.src = pencil;
    this.editBtn.classList.add("edit-button");
    this.buttons.insertAdjacentElement("beforeend", this.deleteBtn);
    this.buttons.insertAdjacentElement("beforeend", this.editBtn);
    this.ticketElement.insertAdjacentElement("beforeend", text);
    this.ticketElement.insertAdjacentElement("beforeend", this.buttons);
  }

  updateTicketElementData(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    if (data.status) {
      this.status = data.status;
    } else {
      this.status = false;
    }
    this.created = data.created;
  }

  updateTicketElement(data) {
    this.ticketElement.remove();
    this.updateTicketElementData(data);
    this.createTicketElement();
  }

  render() {
    this.element.insertAdjacentElement("beforeend", this.ticketElement);
  }
}

module.exports = TicketElement;
