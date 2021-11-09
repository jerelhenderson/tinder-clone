/* Authentication Business Location
    * if the user has not signed in, they should not be able to access the home page
    * if the user has signed in, they should not be able to the login page
*/

window.addEventListener("DOMContentLoaded", () => {
    function shouldRedirectToHomePage(user, isLoginPage) {
        return user && isLoginPage;
    }

    function shouldRedirectToLoginPage(user, isLoginPage) {
        return !user && !isLoginPage;
    }

    // authenticated user information is stored in local storage, then accessed from there
    const authenticatedUser = JSON.parse(localStorage.getItem("auth"));
    const isLoginPage = window.location.href.includes("login");

    if (shouldRedirectToHomePage(authenticatedUser, isLoginPage)) {
      window.location.href = "/";
    } else if (shouldRedirectToLoginPage(authenticatedUser, isLoginPage)) {
        window.location.href = "/login.html";
    }
})