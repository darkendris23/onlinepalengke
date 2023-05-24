

function Login() {
    let username = document.getElementById('user')
    let password = document.getElementById('pass')

    if (username.value == 'user' && password.value == 'admin') {
        console.log('logged in')
        window.location.href = "/dir/main.html"
        sessionStorage.setItem('onlinepalengke_user',user)
    } else {
        alert('Wrong username or password')
    }
}