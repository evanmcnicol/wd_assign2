// waits until the page has fully loaded before running
document.addEventListener("DOMContentLoaded", function () {
  setupMobileMenu();
  setupRegistrationForm();
  setupReservationForm();
  setupRecommendationForm();
});

// sets up the mobile nav toggle behaviour
function setupMobileMenu() {
  // grabs the menu button and menu from the page
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".site-nav");

  // stops if the nav is not on the page
  if (!toggle || !nav) {
    return;
  }

  // closes the menu
  function closeMenu() {
    toggle.classList.remove("active"); // removes the active state from the button
    nav.classList.remove("is-open"); // hides the nav
    document.body.classList.remove("menu-open"); // removes the class from the page body to stop page scrolling
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
  }

  function openMenu() {
    toggle.classList.add("active"); // adds the active state to the button
    nav.classList.add("is-open"); // shows the nav
    document.body.classList.add("menu-open"); // adds the class for the body that adds wide styling
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation menu");
  }


  // toggle the menu open or closed when the button is pressed
  toggle.addEventListener("click", function () {
    if (nav.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // closes the menu if an <a> element is pressed
  nav.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
      closeMenu();
    }
  });

  // allows users to close with the esc key by listening for the input
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // closes the menu and switches the styling if the screen in wider than 768px
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });
}

// gets the form field using its ID
function getField(id) {
  return document.getElementById(id);
}

// checks whether a field is missing or blank
function isEmpty(field) {
  return !field || field.value.trim() === "";
}

// checks whether the entered email is valid, usually following "something@something.something"
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// displays the error beside the field and applies the red text styling
function showError(field, message) {
  if (!field) {
    return;
  }

  field.classList.add("is-invalid");

  var error = document.getElementById(field.id + "Error");
  if (!error) {
    error = document.createElement("span");
    error.id = field.id + "Error";
    error.className = "field-error";
    field.parentNode.appendChild(error);
  }

  error.textContent = message;
}

// removes the error styling and message
function clearError(field) {
  if (!field) {
    return;
  }

  field.classList.remove("is-invalid");

  var error = document.getElementById(field.id + "Error");
  if (error) {
    error.textContent = "";
  }
}

// displays an error message for the group inputs, like radio buttons
function showGroupError(form, groupName, message) {
  var firstField = form.querySelector("[name='" + groupName + "']");
  if (!firstField) {
    return;
  }

  var wrapper = firstField.closest("p");
  var errorId = groupName + "Error";
  var error = document.getElementById(errorId);

  if (!error) {
    error = document.createElement("span");
    error.id = errorId;
    error.className = "field-error";
    wrapper.appendChild(error);
  }

  error.textContent = message;
}

// clears the error message and styling for the group inputs
function clearGroupError(groupName) {
  var error = document.getElementById(groupName + "Error");
  if (error) {
    error.textContent = "";
  }
}

// stops from running if the registration form is not on the page
function setupRegistrationForm() {
  var username = getField("username");
  var password = getField("password");
  var confirmPassword = getField("confirmPassword");

  // checking if the form contains a username, password, and password confirmation
  // this is only used by the registration form
  if (!username || !password || !confirmPassword) {
    return;
  }

  var form = username.closest("form");
  var email = getField("email");
  var phone = getField("phone");
  var dietPreferences = getField("dietPreferences");
  var country = getField("country");

  // clears old error messages before validating the form again
  form.addEventListener("submit", function (event) {
    var valid = true;

    clearError(username);
    clearError(email);
    clearError(phone);
    clearError(password);
    clearError(confirmPassword);
    clearError(dietPreferences);
    clearError(country);
    clearGroupError("gender");

    // checks if the username field is empty and displays error if so, marking it invalid
    if (isEmpty(username)) {
      showError(username, "Username is required.");
      valid = false;
    } else if (!/^\w{5,}$/.test(username.value.trim())) {
      showError(
        username,
        "Username must be at least 5 characters and use only letters, numbers, and underscores.",
      );
      valid = false;

      // ^    start of input
      // \w   letters, numbers, and underscores
      // {5,} at least 5 characters
      // $    end of input
    }

    // checks if the email field is empty and displays error if so, marking it invalid
    if (isEmpty(email)) {
      showError(email, "Email is required.");
      valid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showError(email, "Please enter a valid email address.");
      valid = false;
    }

    // checks if the phone field is empty and displays error if so, marking it invalid
    if (isEmpty(phone)) {
      showError(phone, "Phone number is required.");
      valid = false;
    } else if (!/^\d{8,15}$/.test(phone.value.trim())) {
      showError(
        phone,
        "Phone number must contain digits only and be 8 to 15 digits long.",
      );
      valid = false;

      // \d means only numbers and {8,15} means only 8-15 digits allowed
    }

    // checks if password field is empty and displays error if so, marking it invalid
    if (isEmpty(password)) {
      showError(password, "Password is required.");
      valid = false;
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/.test(
        password.value,
      )
    ) {
      showError(
        password,
        "Password must be at least 10 characters and include uppercase, lowercase, number, and special character.",
      );
      valid = false;

      // validates that the password meets the required strength rules
      // at least one lowercase letter    [a-z]
      // at least one uppercase letter    [A-Z]
      // at least one number              \d
      // at least one special character   [A-Za-z0-9]
      // at least 10 characters total     {10,}
    }

    // checks if the confirm password field is empty and displays an error if so, marking it invalid
    if (isEmpty(confirmPassword)) {
      showError(confirmPassword, "Please confirm your password.");
      valid = false;
    } else if (confirmPassword.value !== password.value) {
      showError(confirmPassword, "Confirm password must match the password.");
      valid = false;

      // makes sure the confirm password field matches the main password field and errors if not
    }

    // checks if the gender field is selected and displays an error if not, marking it invalid
    if (!form.querySelector("input[name='gender']:checked")) {
      showGroupError(form, "gender", "Please select a gender.");
      valid = false;
    }

    // checks if a diet option is selected and displays an error if not, marking it invalid
    if (isEmpty(dietPreferences)) {
      showError(dietPreferences, "Please choose a dietary preference.");
      valid = false;
    }

    // checks if a country option is selected and displays an error if not, marking it invalid
    if (isEmpty(country)) {
      showError(country, "Please choose a country or region.");
      valid = false;
    }

    // prevents the form from submitting if validation checks fail
    if (!valid) {
      event.preventDefault();
    }
  });
}

// stops from running if the reservation form is not on the page
function setupReservationForm() {
  var reservationDate = getField("reservationDate");

  // checking if the form contains a reservation date field
  // this is only used by the reservation form
  if (!reservationDate) {
    return;
  }

  // grabs the fields
  var form = reservationDate.closest("form");
  var fullName = getField("fullName");
  var email = getField("email");
  var phone = getField("phone");
  var restaurant = getField("restaurant");
  var reservationTime = getField("reservationTime");
  var guests = getField("guests");
  var deposit = getField("deposit");
  var paymentMethod = getField("paymentMethod");
  var voucherCode = getField("voucherCode");
  var cardNumber = getField("cardNumber");
  var billingEmail = getField("billingEmail");
  var sameEmail = getField("sameEmail");

  var voucherRow = voucherCode.closest("p");
  var cardRow = cardNumber.closest("p");

  // date validation, function below
  setMinimumReservationDate(reservationDate);

  // selects the restaurant if the page was opened from a restaurant card
  selectRestaurantFromQuery(restaurant);

  // deposit calculation, function below
  updateDeposit(guests, deposit);

  // show/hide the payment fields, function below
  updatePaymentFields(
    paymentMethod,
    voucherRow,
    cardRow,
    voucherCode,
    cardNumber,
  );

  // recalculate the deposit amount live when the number of guests changes
  guests.addEventListener("input", function () {
    updateDeposit(guests, deposit);
  });

  // updates the fields when the selected payment method changes
  paymentMethod.addEventListener("change", function () {
    // clear old payment errors as the fields have changed
    clearError(voucherCode);
    clearError(cardNumber);
    updatePaymentFields(
      paymentMethod,  // selected payment option
      voucherRow,     // area containing voucher input
      cardRow,        // area containing card input
      voucherCode,    // voucher code input
      cardNumber,     // card number input field
    );
    // shows the correct payment fields for the selected payment option
  });

  // sets the billing email to be the value entered in the email field
  sameEmail.addEventListener("change", function () {
    if (sameEmail.checked) {
      billingEmail.value = email.value.trim();
    }
  });

  // keeps the two email fields synced together
  email.addEventListener("input", function () {
    if (sameEmail.checked) {
      billingEmail.value = email.value.trim();
    }
  });

  // clears fields on submit
  form.addEventListener("submit", function (event) {
    var valid = true;
    var fieldsToClear = [
      fullName,
      email,
      phone,
      restaurant,
      reservationDate,
      reservationTime,
      guests,
      paymentMethod,
      voucherCode,
      cardNumber,
      billingEmail,
    ];

    fieldsToClear.forEach(function (field) {
      clearError(field);
    });

    // checks if the name field is populated and displays an error if not, marking it invalid
    if (isEmpty(fullName)) {
      showError(fullName, "Full name is required.");
      valid = false;
    }

    // checks if the email field is populated and displays an error if not, marking it invalid
    if (isEmpty(email)) {
      showError(email, "Email is required.");
      valid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showError(email, "Please enter a valid email address.");
      valid = false;

      // checks if a valid email address is entered and displays an error if not, marking it invalid
    }

    // checks if the phone number field is populated and displays an error if not, marking it invalid
    if (isEmpty(phone)) {
      showError(phone, "Phone number is required.");
      valid = false;
    } else if (!/^\d{8,15}$/.test(phone.value.trim())) {
      showError(phone, "Phone number must contain at least 10 digits.");
      valid = false;

      // checks if the phone number contains at least 10 digits and displays an error if not, marking it invalid
    }

    // checks if a restaurant is selected and displays an error if not, marking it invalid
    if (isEmpty(restaurant)) {
      showError(restaurant, "Please select a restaurant.");
      valid = false;
    }

    // checks if a date is selected and displays an error if not, marking it invalid
    if (isEmpty(reservationDate)) {
      showError(reservationDate, "Reservation date is required.");
      valid = false;
      // checks if the chosen date is in the past and displays an error if so, marking it invalid
    } else if (reservationDate.value < getTodayString()) {
      showError(reservationDate, "Reservation date must not be in the past.");
      valid = false;
    }

    // checks if a time is entered and displays an error if not, marking it invalid
    if (isEmpty(reservationTime)) {
      showError(reservationTime, "Reservation time is required.");
      valid = false;
    }

    // checks if the amount of guests is entered and displays an error if not, marking it invalid
    if (isEmpty(guests)) {
      showError(guests, "Number of people is required.");
      valid = false;
      // ensures the entered amount is not less than 0 and displays an error if so, marking it invalid
    } else if (Number(guests.value) <= 0 || Number(guests.value) > 8) {
      showError(guests, "Number of people must be between 1 and 8.");
      valid = false;
    }

    // checks if a payment method is selected and displays an error if not, marking it invalid
    if (isEmpty(paymentMethod)) {
      showError(paymentMethod, "Please choose a payment method.");
      valid = false;

      // checks if the payment method is set to online payment
    } else if (paymentMethod.value === "Voucher") {
      if (isEmpty(voucherCode)) {
        showError(voucherCode, "Voucher code is required when using a voucher.");
        valid = false;
      }
    } else if (paymentMethod.value === "Online Payment") {
      if (isEmpty(cardNumber)) {
        showError(
          cardNumber,
          "Credit card number is required for online payment.",
        );
        valid = false;
        // checks if a card number is entered and displays an error if not, marking it invalid

        // checks if a time is entered and displays an error if not, marking it invalid
      } else if (!isValidCardNumber(cardNumber.value.trim())) {
        showError(
          cardNumber,
          "Visa/Mastercard must be 16 digits. Amex must be 15 digits.",
        );
        valid = false;
        // allows the two card number formats/types, function below
      }
    }

    // checks if the email and billing email are valid and displays an error if not, marking it invalid
    if (!isEmpty(billingEmail) && !isValidEmail(billingEmail.value.trim())) {
      showError(billingEmail, "Please enter a valid billing email address.");
      valid = false;
    }

    // prevents the form from submitting if any fields are invalid
    if (!valid) {
      event.preventDefault();
    }
  });
}

// prevents the user from setting the reservation date in the past
function setMinimumReservationDate(reservationDate) {
  reservationDate.min = getTodayString();
}

// selects the restaurant from reservation.html?restaurant=value
function selectRestaurantFromQuery(restaurant) {
  var params = new URLSearchParams(window.location.search);
  var selectedRestaurant = params.get("restaurant");

  if (!selectedRestaurant) {
    return;
  }

  var matchingOption = restaurant.querySelector(
    "option[value='" + selectedRestaurant + "']",
  );

  if (matchingOption) {
    restaurant.value = selectedRestaurant;
  }
}

// gets today's date
function getTodayString() {
  var today = new Date();
  var year = today.getFullYear();
  var month = String(today.getMonth() + 1).padStart(2, "0");
  var day = String(today.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

// calculates the deposit based on the amount of guests
// number of guests * $15
// 4 guests = $60.00
function updateDeposit(guests, deposit) {
  var guestCount = Number(guests.value);

  if (guestCount > 0) {
    // makes the output have a dollar sign and amount fixed to two decimal places for cents
    deposit.value = "$" + (guestCount * 15).toFixed(2);
  } else {
    deposit.value = "";
  }
}

// shows the correct payment field depending on the selected payment method
function updatePaymentFields(
  paymentMethod,
  voucherRow,
  cardRow,
  voucherCode,
  cardNumber,
) {
  var method = paymentMethod.value;

  // hides card inputs and clears the value of voucher is selected
  if (method === "Voucher") {
    voucherRow.style.display = "grid";
    cardRow.style.display = "none";
    voucherCode.required = true;
    cardNumber.required = false;
    cardNumber.value = "";

    // hides voucher inputs and clears the value of card is selected
  } else if (method === "Online Payment") {
    voucherRow.style.display = "none";
    cardRow.style.display = "grid";
    voucherCode.required = false;
    cardNumber.required = true;
    voucherCode.value = "";

    // if anything else, show the card input
  } else {
    voucherRow.style.display = "none";
    cardRow.style.display = "none";
    voucherCode.required = false;
    cardNumber.required = false;
  }
}

// accepts either 16 or 15 digit card numbers (16 for via/mastercard and 15 for amex)
function isValidCardNumber(cardNumber) {
  return /^\d{16}$/.test(cardNumber) || /^\d{15}$/.test(cardNumber);
}

// checks if the recommendation form exists
function setupRecommendationForm() {
  var form = getField("recommendForm");

  if (!form) {
    return;
  }

  // grabs the fields and dynamically creates the areas
  var dietPreferences = getField("dietPreferences");
  var budget = getField("budget");
  var purpose = getField("purpose");
  var results = document.createElement("div");

  results.id = "recommendationResults";
  results.style.marginTop = "1.5rem";
  form.after(results);

  // stops the recommendation system from running until all the options are selected
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var valid = true;

    // clears errors
    clearError(dietPreferences);
    clearError(budget);
    clearError(purpose);

    // checks if a diet option is selected and displays an error if not, marking it invalid
    if (isEmpty(dietPreferences)) {
      showError(dietPreferences, "Please choose a dietary preference.");
      valid = false;
    }

    // checks if a budget option is selected and displays an error if not, marking it invalid
    if (isEmpty(budget)) {
      showError(budget, "Please choose a budget range.");
      valid = false;
    }

    // checks if a purpose option is selected and displays an error if not, marking it invalid
    if (isEmpty(purpose)) {
      showError(purpose, "Please choose a dining purpose.");
      valid = false;
    }

    // makes results blank if any of the options are invalid
    if (!valid) {
      results.innerHTML = "";
      return;
    }

	// runs the recommendation system on the selected options, then displays the results
    showRecommendations(
      dietPreferences.value,
      budget.value,
      purpose.value,
      results,
    );
  });
}

// grabs the options selected in the selectors
// each restaurant begins with a score of 0 and the reasons array empty
function showRecommendations(
  selectedDiet,
  selectedBudget,
  selectedPurpose,
  results,
) {
  var restaurants = getRestaurants();

  restaurants.forEach(function (restaurant) {
    restaurant.score = 0;
    restaurant.reasons = [];

    // if the budget matches the restaurant, that restaurant gets 3 points
    if (restaurant.budgets.indexOf(selectedBudget) !== -1) {
      restaurant.score += 3;
      restaurant.reasons.push("matches your budget");
      // adds the budget match text to be displayed if its a match
    }

    // if the purpose matches the restaurant, that restaurant gets 3 points
    if (restaurant.purposes.indexOf(selectedPurpose) !== -1) {
      restaurant.score += 3;
      restaurant.reasons.push("suits your dining purpose");
      // adds the purpose match text to be displayed if its a match
    }

    // if the diet matches the restaurant, that restaurant gets 3 points
    if (
      selectedDiet === "none" ||
      restaurant.diets.indexOf(selectedDiet) !== -1
    ) {
      restaurant.score += 3;
      restaurant.reasons.push("fits your dietary preference");
      // adds the diet match text to be displayed if its a match
    } else {
      restaurant.score -= 2;
      // takes away 2 points if the restaurant does not match
    }
  });

  // scores the restaurants from highest score to lowest score
  restaurants.sort(function (a, b) {
    return b.score - a.score;
  });

  // only takes the top 3 restaurants
  var bestMatches = restaurants.slice(0, 3);

  // creates the HTML to be displayed
  var html = "<h3>Recommended Restaurants</h3>";

  bestMatches.forEach(function (restaurant) {
    // creates the card container and adds a margin at the top of 1rem
    html += "<article class='restaurant-card' style='margin-top: 1rem;'>";

    // creates the cards body
    html += "<div class='card-body'>";

    // grabs the matched restaurant name from the array
    html += "<h3>" + restaurant.name + "</h3>";

    // grabs the matched restaurant price from the array
    html += "<p class='card-meta'>" + restaurant.price + " per person</p>";

    // grabs the matched restaurant description from the array
    html += "<p>" + restaurant.description + "</p>";

    // grabs the matched restaurant reasons from the array
    html +=
      "<p><strong>Why this matches:</strong> " +
      restaurant.reasons.join(", ") +
      ".</p>";

    // adds the ghost reservation button with the correct link for the form
    html +=
      "<div class='card-foot'><a class='btn btn-ghost' href='reservation.html?restaurant=" +
      restaurant.value +
      "'>Reserve &rarr;</a></div>";
    html += "</div>";
    html += "</article>";
  });

  // builds the HTML for the cards in the result area
  results.innerHTML = html;
}

// stores the rstaurant information in an array
function getRestaurants() {
  return [
    {
      name: "Princess Peach's Castle Catering",
      value: "peach",
      price: "$75-$110", 				// sets the price to display this restaurant matches
      budgets: ["high"], 				// sets the price range matching the form option
      purposes: ["date", "family"], 	// sets the purpose option matching the form option
      diets: ["none", "vegetarian"], 	// sets the diet option matching the form option
      description:
        "A polished royal dining experience for dates and special celebrations.",
    },
    {
      name: "Lon Lon Ranch House",
      value: "lonlon",
      price: "$35-$55",
      budgets: ["low", "medium"],
      purposes: ["family", "group"],
      diets: ["none", "vegetarian"],
      description:
        "A relaxed ranch-style restaurant with warm comfort food and family-friendly meals.",
    },
    {
      name: "Seventh Heaven Bar",
      price: "$60-$95",
      value: "seventh",
      budgets: ["medium", "high"],
      purposes: ["date", "group"],
      diets: ["none", "dairyFree"],
      description:
        "A neon-lit lounge for dates, friends, and late-night dining.",
    },
    {
      name: "Koopa's BBQ",
      value: "koopa",
      price: "$40-$65",
      budgets: ["medium"],
      purposes: ["group"],
      diets: ["none", "dairyFree"],
      description:
        "A bold grillhouse with shareable meals and a lively group dining atmosphere.",
    },
    {
      name: "Zora's Kitchen",
      value: "zora",
      price: "$70-$105",
      budgets: ["high"],
      purposes: ["business", "date"],
      diets: ["none", "halal", "glutenFree", "dairyFree"],
      description:
        "An elegant seafood restaurant suited to business meals, formal dates, and lighter dishes.",
    },
    {
      name: "Midgar Grill",
      value: "midgar",
      price: "$55-$85",
      budgets: ["medium", "high"],
      purposes: ["business", "group"],
      diets: ["none", "glutenFree", "dairyFree"],
      description:
        "A modern city grill for business meals, groups, and serious urban dining.",
    },
  ];
}
