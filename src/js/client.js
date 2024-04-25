const URL = require("./settings")

class Client {


  static url = URL;
  static header = {"Content-Type": "application/json"};



  static async allTickets() {
    const url = this.url + "?method=allTickets"
    const res = await fetch(url, {
      method : "GET",
      headers : this.header
    })
    return await res.json();
  }

  static async ticketById(data) {
    const url = this.url + "?method=ticketById&id=" + data.id;
    const res = await fetch(url, {
      method : "GET",
      headers : this.header
    })
    return await res.json();
  }

  static async createTicket(data) {
    const body = {
      name: data.name,
      description: data.description,
    }
    const url = this.url + "?method=createTicket";
    const res = await fetch(url, {
      method : "POST",
      headers : this.header,
      body: JSON.stringify(body)
    })
    return await res.json();
  }

  static async deleteTicketById(data) {
    const url = this.url + "?method=deleteTicketById&id=" + data.id;
    const res = await fetch(url, {
      method : "DELETE",
      headers : this.header
    })
    return await res.json();
  }

  static async patchTicketById(data) {
    let body = {};
    if (data.description) {
      body = {
        id: data.id,
        name: data.name,
        description: data.description,
        status: data.status
      };
    } else {
        body = {
        id: data.id,
        name: data.name,
        status: data.status
      };
    }

    // for(const attr in data) {
    //   console.log(attr)
    //   if (!data[attr]) {
    //     continue;
    //   } else {
    //     body[attr] = data[attr]
    //   }
    // }
    const url = this.url + "?method=patchTicketById&id=" + data.id;
    const res = await fetch(url, {
      method : "PATCH",
      headers : this.header,
      body: JSON.stringify(body)
    })
    return await res.json();
  }
}

module.exports = Client;
