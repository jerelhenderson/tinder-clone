/*
  Business Logic for Login Interactions
*/

hideLoading();

// signup buttons
const signUpContainer = document.getElementById("signup");
const signUpCloseBtn = document.getElementById("signup__close-btn");
const createNewAccountBtn = document.getElementById("login__create-account-btn");

// store user input info input elements and validate
const selectedAvatar = document.getElementById("signup__selected-avatar");
const avatarClose = document.getElementById("signup__avatar-close");
const avatarLabel = document.getElementById("signup__avatar-label");
const avatarInputElement = document.getElementById("signup__avatar");
const emailInputElement = document.getElementById("signup__email");
const passwordInputElement = document.getElementById("signup__password");
const confirmPasswordInputElement = document.getElementById("signup__confirm-password");
const fullNameInputElement = document.getElementById("signup__fullname");
const ageInputElement = document.getElementById("signup__age");
const genderSelectElement = document.getElementById("signup__gender");

const emailLoginInputElement = document.getElementById("login__email");
const passwordLoginInputElement = document.getElementById("login__password");
// get sign up button
const signUpBtn = document.getElementById("signup__btn");
// get login button
const loginBtn = document.getElementById("login__submit-btn");

// -------------------------------------------------------------------------------

function hideSignUp() {
  signUpContainer.classList.add("signup--hide");
  // clear input elements
  if (emailInputElement && passwordInputElement && confirmPasswordInputElement) {
    emailInputElement.value = "";
    passwordInputElement.value = "";
    confirmPasswordInputElement.value = "";
  }
}

if (signUpCloseBtn) {
  signUpCloseBtn.addEventListener("click", () => {
    hideSignUp();
  });
}

if (createNewAccountBtn) {
  createNewAccountBtn.addEventListener("click", () => {
    signUpContainer.classList.remove("signup--hide");
  });
}

/**
 * validate input user's information when creating a new account
 * @param {*} object - user's information that needs to be validated
 * @returns valid, or not
 */
function validateNewAccount({ avatars, email, password, confirmPassword, fullname, age, gender }) {
  if (!avatars || avatars.length === 0) {
    alert("Please select avatar");
    return false;
  }
  if (avatars.length > 1) {
    alert("Please select a single image");
    return false;
  }
  const avatar = avatars[0];
  if (avatar && !avatar.type.includes("jpeg")) {
    alert("Your avatar must be jpeg format");
    return false;
  }
  if (!validator.isEmail(email)) {
    alert("Please input your email");
    return false;
  }
  if (
    validator.isEmpty(password) ||
    !validator.isLength(password, { min: 6 })
  ) {
    alert(
      "Please input your password. You password must have at least 6 characters"
    );
    return false;
  }
  if (validator.isEmpty(confirmPassword)) {
    alert("Please input your confirm password");
    return false;
  }
  if (password !== confirmPassword) {
    alert("Confirm password and password must be the same");
    return false;
  }
  if (validator.isEmpty(fullname)) {
    alert("Please iput your fullname");
    return false;
  }
  if (validator.isEmpty(age) || !validator.isNumeric(age)) {
    alert("Please input your age, your age must be a number");
    return false;
  }
  if (validator.isEmpty(gender)) {
    alert("Please input your gender");
    return false;
  }
  return true;
}

const resetAvatarSelection = () => {
  selectedAvatar.src = "";
  selectedAvatar.classList.remove("show");
  selectedAvatar.classList.add("hide");
  avatarClose.classList.remove("show");
  avatarClose.classList.add("hide");
  avatarLabel.classList.remove("hide");
  avatarLabel.classList.add("show");
  avatarInputElement.value = "";
};

if (avatarClose) {
  avatarClose.addEventListener("click", () => {
    resetAvatarSelection();
  });
}

const onAvatarSelected = (input) => {
  if (input) {
    selectedAvatar.src = (window.URL ? URL : webkitURL).createObjectURL(
      input.files[0]
    );
    selectedAvatar.classList.remove("hide");
    selectedAvatar.classList.add("show");
    avatarClose.classList.remove("hide");
    avatarClose.classList.add("show");
    avatarLabel.classList.remove("show");
    avatarLabel.classList.add("hide");
  }
};

const resetSignUpForm = () => {
  resetAvatarSelection();
  emailInputElement.value = ''
  passwordInputElement.value = ''
  confirmPasswordInputElement.value = ''
  fullNameInputElement.value = ''
  ageInputElement.value = ''
  genderSelectElement.value = 'Male'
};

/* New Registration Business Logic
Take JSON object of user input information, validate it and return new account if meets all checks
*/
const registerNewAccount = ({ avatar, email, password, fullname, age, gender }) => {

    showLoading();

    const userUuid = uuid.v4();
    const form = new FormData();

    form.append("avatar", avatar);
    form.append("email", email);
    form.append("password", password);
    form.append("age", age);
    form.append("gender", gender);
    form.append("ccUid", userUid);
    form.append("fullname", fullname);
    axios.post("/users/create", form).then((res) => {
        if (res && res.data && res.data.message) {
            alert(res.data.message);
        } else if (res && res.data && res.data.insertId) {
            const user = new CometChat.User(userUuid);
            user.setName(fullname);
            user.setAvatar(`${window.location.origin}${rest.data.avatar}`);
            const appSetting = new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(config.CometChatRegion).build();

            CometChat.init(config.CometChatAppId, appSetting).then(() => {
                CometChat.createUser(user, config.CometChatAuthKey).then((user) => {
                    alert("Account created successfully");
                }, (error) => {
                    //
                });
            }, (error) => {
                //
            });
            hideLoading();
            resetSignUpForm();
            hideSignUp();
        } else {
            alert("Cannot create account. Please try again.");
        }
    })
    .catch((error) => {
        hideLoading();
    });
}

// Signup Button
if (signUpBtn) {
  signUpBtn.addEventListener("click", () => {
    if (avatarInputElement && emailInputElement && passwordInputElement && confirmPasswordInputElement && fullNameInputElement && ageInputElement && genderSelectElement) {
      const avatars = avatarInputElement.files;
      const email = emailInputElement.value;
      const password = passwordInputElement.value;
      const confirmPassword = confirmPasswordInputElement.value;
      const fullname = fullNameInputElement.value;
      const age = ageInputElement.value;
      const gender = genderSelectElement.value;

      if (
        validateNewAccount({ avatars, email, password, confirmPassword, fullname, age, gender })
      ) {
        registerNewAccount({ avatar: avatars[0], email, password, fullname, age, gender });
      }
    }
  });
}

/**
 * Check user credentials
 * @param {*} object credentials
 * @returns valid or nah
 */
function isUserCredentialsValid({ email, password }) {
  return (
    email &&
    password &&
    validator.isEmail(email) &&
    validator.isLength(password, { min: 6 })
  );
}

/* Login Button Business Logic
Receive user input from the index.html input elements, then validate... if a-ok, the Login API allows access... else redirect to home page
*/
loginBtn.addEventListener("click", () => {
    showLoading();

    // get input user's credentials
    const email = emailLoginInputElement ? emailLoginInputElement.value : null;
    const password = passwordLoginInputElement ? passwordLoginInputElement.value : null;

    if (isUserCredentialsValid({ email, password })) {
      axios.post("/login", { email, password })
        .then((res) => {
          if (res && res.data && res.data.uid) {
            const appSetting = new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers()
              .setRegion(config.CometChatRegion)
              .build();
            CometChat.init(config.CometChatAppId, appSetting).then(
              () => {
                // if everything is successful, call the login function
                CometChat.login(res.data.uid, config.CometChatAuthKey).then(
                  (loggedInUser) => {
                    hideLoading();
                    // store logged in user in the local storage
                    localStorage.setItem("auth", JSON.stringify({ ...loggedInUser, gender: res.data.gender }));
                    // redirect to home page
                    window.location.href = "/";
                  }
                );
              },
              (error) => {
                // Check the reason for error and take appropriate action
              }
            );
          } else {
            // hide loading
            hideLoading();
            alert("Username or password is not correct");
          }

        })
        .catch((error) => {
          if (error) {
            hideLoading();
            alert("Username or password is not correct");
          }
        });
    } else {
      // hide loading indicator
      hideLoading();
      alert("Username or password is not correct");
    }
  });