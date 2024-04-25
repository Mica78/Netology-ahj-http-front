import TicketElement from "./ticket-element";

const Client = require("./client");


export class App {
  constructor(element) {
    this.element = document.querySelector(element);
    this.onClick = this.onClick.bind(this);
    this.element.addEventListener("click", this.onClick);
    this.ticketElements = [];
  }

  async onClick(e) {
    e.preventDefault();
    if (e.target.classList.contains("ticket-name")) {
      this.showTicketDescription(e)
    }

    if (e.target.classList.contains("ticket-status")) {

      this.changeTicketStatus(e)
    }

    if (e.target.classList.contains("delete-button")) {
      this.removeTicket(e)
    }

    if (e.target.classList.contains("add")) {
      this.addTicket(e)
    }

    if (e.target.classList.contains("edit-button")) {
      this.editTicket(e)
    }

  }

  async run() {
    const allTickets = await Client.allTickets();
    for (const ticket of allTickets) {
      const ticketElement = new TicketElement(this.element.querySelector(".tickets"), ticket);
      ticketElement.createTicketElement();
      ticketElement.render()
      this.ticketElements.push(ticketElement);
    }
  }

  async showTicketDescription(e) {
    const ticketElement = this.ticketElements.find(
      ticketElement => ticketElement.nameElement === e.target
      );
    const data = await Client.ticketById(ticketElement);
    const nextSibling = ticketElement.ticketElement.nextSibling;
    ticketElement.updateTicketElement(data);
    if(!nextSibling) {
      ticketElement.render()
    } else {
      ticketElement.element.insertBefore(ticketElement.ticketElement, nextSibling)
    }

  }

  async changeTicketStatus(e) {
    const ticketElement = this.ticketElements.find(
      ticketElement => ticketElement.ticketElement === e.target.closest(".ticket")
      );
    ticketElement.status = !ticketElement.status;
    const res = await Client.patchTicketById(ticketElement);
    if (res.status !== "OK") {
      return
    }
    ticketElement.radioElement.checked = ticketElement.status;
  }

  async removeTicket(e) {
    const form = document.querySelector("body").insertAdjacentElement("beforeend", this.deleteForm);
    form.querySelector("button[type=reset]").addEventListener("click", (e) => form.remove());
    form.querySelector("button[type=submit]").addEventListener("click", async (event) => {
      event.preventDefault();

      form.remove();

      const ticketElement = this.ticketElements.find(
        ticketElement => ticketElement.deleteBtn === e.target
        );

      const responce = await Client.deleteTicketById(ticketElement);

      if (responce.status = "OK") {
        this.ticketElements.forEach(ticket => ticket.ticketElement.remove())
        this.ticketElements.length = 0;
        await this.run();
      }
    })
  }

  get createForm() {
    const form = document.createElement("form");
    form.id = "f";
    form.innerHTML = `
      <input form="f" name="name" class="input__name" type="text" placeholder="Enter a name" required>
      <input form="f" name="description" class="input__description" type="text" placeholder="Enter a description">
      <div class="form-buttons">
        <button form="f" type="submit" class="btn">Ok</button>
        <button form="f" type="reset" class="btn">Отмена</button>
      </div>`;
    return form;
  }

  get deleteForm() {
    const form = document.createElement("div");
    form.classList.add("delete-form");
    form.innerHTML = `
      <p>Неужто удалить?</p>
      <div class="form-buttons">
        <button form="f" type="submit" class="btn">Ok</button>
        <button form="f" type="reset" class="btn">Отмена</button>
      </div>`;
    return form;
  }

  async addTicket() {
    const form = document.querySelector("body").insertAdjacentElement("beforeend", this.createForm);
    form.querySelector("button[type=reset]").addEventListener("click", (e) => form.remove());
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const ticket = {
        name: formData.get("name"),
        description: formData.get("description")
      }
      const res = await Client.createTicket(ticket);
      if (res) {
        form.remove();
        this.ticketElements.forEach(ticket => ticket.ticketElement.remove())
        this.ticketElements.length = 0;
        await this.run();
      }

    })
  }

  async editTicket(e) {
    const ticketElement = this.ticketElements.find(
      ticketElement => ticketElement.ticketElement === e.target.closest(".ticket")
      );
    const form = document.querySelector("body").insertAdjacentElement("beforeend", this.createForm);
    form.name.value = ticketElement.name;
    if (ticketElement.description) {
      form.description.value = ticketElement.description;
    } else {
      form.description.value = "";
    }

    form.querySelector("button[type=reset]").addEventListener("click", (e) => form.remove())
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const ticket = {
        name: formData.get("name"),
        description: formData.get("description")
      }
      ticketElement.name = ticket.name;
      ticketElement.description = ticket.description;
      const res = await Client.patchTicketById(ticketElement);
        if (res.status !== "OK") {
          return
        };
      form.remove();
      this.ticketElements.forEach(ticket => ticket.ticketElement.remove())
      this.ticketElements.length = 0;
      await this.run();
    })
  }
}
