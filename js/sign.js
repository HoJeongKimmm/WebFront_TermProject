// Registration functionality
document.addEventListener('DOMContentLoaded', function() {
    const registerBtn = document.querySelector('.member-container .btn button');
  
    registerBtn.addEventListener('click', function(event) {
      event.preventDefault();
      const email = document.querySelector('.user-info-email input').value;
      const name = document.querySelector('.user-info-name input').value;
      const password = document.querySelector('.user-info-pw input').value;
  
      localStorage.setItem('email', email);
      localStorage.setItem('name', name);
      localStorage.setItem('password', password);
  
      alert('회원가입이 완료되었습니다!');
    });
  });
  
  // Login functionality
  document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.querySelector('.login-container .btn button');
  
    loginBtn.addEventListener('click', function(event) {
      event.preventDefault();
      const enteredEmail = document.querySelector('.login-info-email input').value;
      const enteredPassword = document.querySelector('.login-info-pw input').value;
  
      const storedEmail = localStorage.getItem('email');
      const storedPassword = localStorage.getItem('password');
  
      if (enteredEmail === storedEmail && enteredPassword === storedPassword) {
        alert('로그인 성공!');
      } else {
        alert('이메일 또는 비밀번호가 잘못되었습니다.');
      }
    });
  });
  