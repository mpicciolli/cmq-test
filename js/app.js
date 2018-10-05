jQuery(function($) {
  "use strict";

  var contacts;

  var dataController = {
    getContacts: function(callback) {
      $.ajax({
        type: "GET",
        url: "contacts.json",
        success: function(data) {
          contacts = Object.keys(data).map(function(k) {
            return data[k];
          });
          callback(contacts);
        },
        error: function(req, error) {
          alert("An error occurred");
        }
      });
    },
    createNewContact: function(contact, callback) {
      $.ajax({
        type: "POST",
        url: "/employees",
        data: contact,
        success: function(data) {
          callback();
        },
        error: function(req, error) {
          console.log("Fake POST request");
          callback();
        }
      });
    },
    updateContact: function(contact, callback) {
      $.ajax({
        type: "UPDATE",
        url: "/employees",
        data: contact,
        success: function(data) {
          callback();
        },
        error: function(req, error) {
          console.log("Fake UPDATE request");
          callback();
        }
      });
    },
    deleteContact: function(contact, callback) {
      $.ajax({
        type: "DELETE",
        url: "/employees",
        data: contact,
        success: function(data) {
          callback();
        },
        error: function(req, error) {
          console.log("Fake DELETE request");
          callback();
        }
      });
    },
    getEmployeeAsync: function(companyId, employeeId) {
      return $.get("contacts.json");
    }
  };

  var init = function() {
    contacts = dataController.getContacts(renderContacts);
    bindEvents();
  };

  var bindEvents = function() {
    $("#contact-form").on("submit", onSubmitNewContactModal);
    $("#contact-filter").on("keyup", onFilterByName);
  };

  var renderContacts = function(contacts) {
    $("#contact-list").empty();
    contacts.map(contact => {
      $("#contact-list").append(createContactElement(contact));
    });
  };

  var createContactElement = function(contact) {
    var contactElement = $("<tr></tr>")
      .append(
        '<th scope="row"><input type="checkbox" class="form-check-input"></th>'
      )
      .append(createEditableElement(contact.name))
      .append(createEditableElement(contact.phone))
      .append(createEditableElement(contact.email));

    var editBtn = $(
      '<button class="btn btn-sm btn-icon">' +
        '<i class="fa fa-pencil"></i>' +
        '<i class="fa fa-save"></i>' +
        "</button>"
    ).click(onChangeEditMode);

    var deleteBtn = $(
      '<button class="btn btn-sm btn-icon">' +
        '<i class="fa fa-trash"></i>' +
        "</button>"
    ).click(onDeleteContact);

    var cellActions = $("<td></td>");
    cellActions.append(editBtn).append(deleteBtn);
    contactElement.append(cellActions);
    return contactElement;
  };

  var createEditableElement = function(value) {
    return $(
      "<td><label>" +
        value +
        '</label><input type="text" class="form-control" value="' +
        value +
        '"></td>'
    );
  };

  var onSubmitNewContactModal = function(e) {
    var contact = {
      name: $("#contact-name").val(),
      phone: $("#contact-phone").val(),
      email: $("#contact-email").val()
    };

    dataController.createNewContact(contact, function() {
      contacts.push(contact);
      $("#newContactModal").modal("toggle");
      renderContacts(contacts);
      resetFilter();
    });

    return false;
  };

  var onFilterByName = function() {
    var search = $("#contact-filter").val();

    $("#contact-list")
      .children("tr")
      .each(function(index) {
        var contact = contacts[index];
        if (
          contact.name.toLowerCase().indexOf(search) > -1 ||
          contact.phone.toLowerCase().indexOf(search) > -1 ||
          contact.email.toLowerCase().indexOf(search) > -1
        ) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
  };

  var resetFilter = function() {
    $("#filter-name").val("");
  };

  var onChangeEditMode = function(e) {
    var editBtn = $(e.target);
    var rowElement = editBtn.parents("tr");

    if (rowElement.hasClass("editMode")) {
      saveContact(rowElement, editBtn.parents("tr").index());
      rowElement.removeClass("editMode");
    } else {
      rowElement.addClass("editMode");
    }
  };

  var saveContact = function(rowElement, contactIndex) {
    var contact = getContactByRow(rowElement);

    dataController.updateContact(contact, function() {
      contacts[contactIndex] = contact;
      renderContacts(contacts);
    });
  };

  var getContactByRow = function(rowElement) {
    return {
      name: rowElement
        .find("input[type=text]")
        .eq(0)
        .val(),
      phone: rowElement
        .find("input[type=text]")
        .eq(1)
        .val(),
      email: rowElement
        .find("input[type=text]")
        .eq(2)
        .val()
    };
  };

  var onDeleteContact = function(e) {
    var deleteBtn = $(e.target);
    var contact = getContactByRow(deleteBtn.parents("tr"));

    dataController.deleteContact(contact, function() {
      deleteBtn.parents("tr").remove();
      contacts.splice(deleteBtn.parents("tr").index(), 1);
    });
  };

  /* Question bonus: */
  var getBonus = function() {
    Promise.all([
      dataController.getEmployeeAsync(1, 1),
      dataController.getEmployeeAsync(1, 2)
    ]).then(function(data) {
      console.log(data[0]); // Employée 1
      console.log(data[1]); // Employée 2
    });
  };

  init();
});
