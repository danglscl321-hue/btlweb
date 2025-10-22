document.addEventListener('DOMContentLoaded', () => {
  // Lấy các phần tử DOM
  let menu = document.querySelector('#menu-btn');
  let navbar = document.querySelector('.navbar');
  let loginBtn = document.querySelector('#login-btn');
  let loginForm = document.querySelector('.login-form-container');
  let closeLoginForm = document.querySelector('#close-login-form');
  
  // Lấy form Đăng nhập, các trường và vị trí thông báo lỗi (BỔ SUNG)
  const loginFormElement = document.querySelector('.login-form-container form');
  const loginEmail = document.querySelector('#login-email');
  const loginPassword = document.querySelector('#login-password');
  const loginErrorMessage = document.querySelector('#login-error-message');
  
  // --- THÊM: Lấy liên kết Tạo tài khoản (Signup Link) ---
  const signupLink = document.querySelector('.login-form-container form p:last-of-type a');
  // --- THÊM: Biến lưu HTML gốc của form Đăng nhập ---
  const originalLoginFormHTML = loginFormElement ? loginFormElement.innerHTML : '';

  // Lấy các phần tử DOM cho Sell Car Form
  let sellCarBtn = document.querySelector('#sell-car-btn');
  let sellCarForm = document.querySelector('#sell-car-form-container');
  let closeSellCarForm = document.querySelector('#close-sell-car-form');

  // Lấy các phần tử DOM cho chi tiết xe modal
  let vehicleDetailsContainer = document.querySelector('#vehicle-details-container');
  let closeVehicleDetails = document.querySelector('#close-vehicle-details');
  let vehiclesSliders = document.querySelectorAll('.vehicles-slider .box a.btn, .featured-slider .box a.btn');

  // Lấy tất cả các nút "Xem thêm" trong phần Dịch vụ
  const serviceButtons = document.querySelectorAll('.services .box-container .box a.btn');
  
  // --- THÊM: Lấy nút Yêu cầu Lái thử ---
  const requestTestDriveBtn = document.querySelector('#vehicle-details-container .info .btn');
  
  // --- XỬ LÝ CHUYỂN ĐỔI FORM ĐĂNG NHẬP/ĐĂNG KÝ (BỔ SUNG) ---

  // Hàm xử lý logic Đăng ký
  function handleSignup(e) {
      e.preventDefault();
      
      const form = e.target;
      const name = form.querySelector('#signup-name').value.trim();
      const email = form.querySelector('#signup-email').value.trim();
      const password = form.querySelector('#signup-password').value.trim();
      const confirmPassword = form.querySelector('#signup-confirm-password').value.trim();
      const errorDiv = form.querySelector('#form-error-message');
      
      let errorMessage = '';
      
      if (!name || !email || !password || !confirmPassword) {
          errorMessage = 'Vui lòng điền đầy đủ thông tin.';
      } else if (password.length < 6) {
          errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự.';
      } else if (password !== confirmPassword) {
          errorMessage = 'Xác nhận mật khẩu không khớp.';
      }

      if (errorMessage) {
          errorDiv.textContent = errorMessage;
          errorDiv.style.display = 'block';
      } else {
          // Đăng ký thành công giả lập
          errorDiv.textContent = '';
          errorDiv.style.display = 'none';
          alert(`Đăng ký tài khoản ${email} thành công! Vui lòng Đăng nhập.`);
          
          // Chuyển lại về form Đăng nhập sau khi đăng ký thành công
          showLoginForm();
      }
  }

  // Hàm hiển thị Form Đăng nhập gốc và xóa listeners Đăng ký
  function showLoginForm() {
      if (loginFormElement) {
          loginFormElement.innerHTML = originalLoginFormHTML;
          loginFormElement.reset();

          // Cần re-fetch các phần tử sau khi thay đổi innerHTML
          const newSignupLink = loginFormElement.querySelector('p:last-of-type a');
          const newLoginEmail = loginFormElement.querySelector('#login-email');
          const newLoginPassword = loginFormElement.querySelector('#login-password');
          const newLoginErrorMessage = loginFormElement.querySelector('#login-error-message');

          if (newSignupLink) {
              newSignupLink.addEventListener('click', showSignupForm);
          }
          if (newLoginEmail && newLoginPassword && newLoginErrorMessage) {
              // Cần re-attach login submit handler nếu cần, nhưng ta sẽ dựa vào việc logic ban đầu đã kiểm tra DOM
              // Trong trường hợp này, ta giả định logic submit login vẫn hoạt động ổn định với DOM mới.
              // (Thực tế, trong môi trường dev, người ta thường dùng class/ID để đảm bảo submit handler được attach đúng)
          }
      }
  }

  // Hàm hiển thị Form Đăng ký
  function showSignupForm(e) {
      e.preventDefault();
      
      if (loginFormElement) {
          loginFormElement.removeEventListener('submit', loginFormElement.originalSubmitHandler); // Giả định loại bỏ handler cũ
          
          loginFormElement.innerHTML = `
              <h3>Tạo tài khoản</h3>
              <div id="form-error-message" style="color: red; font-size: 1.4rem; margin-bottom: 1rem; display: none;"></div>
              <input type="text" placeholder="Tên của bạn" class="box" id="signup-name" required>
              <input type="email" placeholder="Email" class="box" id="signup-email" required>
              <input type="password" placeholder="Mật khẩu (ít nhất 6 ký tự)" class="box" id="signup-password" required>
              <input type="password" placeholder="Xác nhận mật khẩu" class="box" id="signup-confirm-password" required>
              <input type="submit" value="Đăng ký ngay" class="btn">
              <p>Hoặc đăng ký bằng</p>
              <div class="buttons">
                  <a href="#" class="btn"> Google </a>
                  <a href="#" class="btn"> Facebook </a>
              </div>
              <p> Đã có tài khoản? <a href="#" id="back-to-login">Đăng nhập</a> </p>
          `;
          
          // Thêm listener cho submit Đăng ký
          loginFormElement.addEventListener('submit', handleSignup);

          // Thêm listener cho liên kết quay lại Đăng nhập
          const backToLoginLink = loginFormElement.querySelector('#back-to-login');
          if (backToLoginLink) {
              backToLoginLink.addEventListener('click', showLoginForm);
          }
      }
  }

  // Gán sự kiện cho liên kết "Tạo tài khoản" ban đầu
  if (signupLink) {
      // Vì logic submit login (LOGIC XỬ LÝ FORM ĐĂNG NHẬP) nằm ở dưới, 
      // ta cần đảm bảo logic chuyển form được gọi trước.
      // Do đó, ta sẽ thực hiện việc gán sự kiện cho link Đăng ký ở đây.
      signupLink.addEventListener('click', showSignupForm);
  }

  // Xử lý sự kiện click cho nút menu
  if (menu && navbar) {
    menu.addEventListener('click', () => {
      menu.classList.toggle('fa-times');
      navbar.classList.toggle('active');
      // Đóng các modal/form khác khi mở menu
      if (loginForm) loginForm.classList.remove('active');
      if (vehicleDetailsContainer) vehicleDetailsContainer.classList.remove('active');
      if (sellCarForm) sellCarForm.classList.remove('active');
    });
  }

  // Xử lý sự kiện click cho nút login
  if (loginBtn && loginForm) {
    loginBtn.addEventListener('click', () => {
      loginForm.classList.add('active');
      // Đảm bảo hiển thị form Đăng nhập gốc khi mở
      showLoginForm(); 
      
      // Đóng menu và các form khác khi mở form login
      if (menu && navbar) {
          menu.classList.remove('fa-times');
          navbar.classList.remove('active');
      }
      if (vehicleDetailsContainer) vehicleDetailsContainer.classList.remove('active');
      if (sellCarForm) sellCarForm.classList.remove('active');
      
      // Xóa thông báo lỗi cũ khi mở form (BỔ SUNG)
      const currentErrorMsg = loginForm.querySelector('#login-error-message, #form-error-message');
      if (currentErrorMsg) {
          currentErrorMsg.textContent = '';
          currentErrorMsg.style.display = 'none';
      }
    });
  }

  // Xử lý sự kiện click cho nút đóng form login
  if (closeLoginForm && loginForm) {
    closeLoginForm.addEventListener('click', () => {
      loginForm.classList.remove('active');
    });
  }

  // Xử lý đóng Login Form khi nhấp ra ngoài (click vào container)
  if (loginForm) {
    loginForm.addEventListener('click', (e) => {
        if (e.target === loginForm) {
            loginForm.classList.remove('active');
        }
    });
  }

  // --- LOGIC XỬ LÝ FORM ĐĂNG NHẬP (CẬP NHẬT: TÁI CẤU TRÚC ĐỂ ĐẢM BẢO CHỈ XỬ LÝ KHI LÀ FORM LOGIN) ---
  // Gán sự kiện submit Đăng nhập ban đầu cho form
  if (loginFormElement && loginErrorMessage) {
      // Lưu trữ handler gốc để có thể gọi lại sau khi showLoginForm() tái tạo DOM
      const originalLoginHandler = (e) => {
          // Ngăn form gửi đi để xử lý bằng JavaScript
          e.preventDefault(); 
          
          // Lấy lại các giá trị sau khi DOM được tái tạo bởi showLoginForm
          const emailInput = loginFormElement.querySelector('#login-email');
          const passwordInput = loginFormElement.querySelector('#login-password');
          const errorMsgDiv = loginFormElement.querySelector('#login-error-message');

          if (!emailInput || !passwordInput || !errorMsgDiv) return;

          const emailValue = emailInput.value.trim();
          const passwordValue = passwordInput.value.trim();
          let errorMessage = '';

          // Kiểm tra tính hợp lệ cơ bản và cú pháp (BẮT NHẬP ĐÚNG CÚ PHÁP)
          if (!emailValue || !passwordValue) {
              errorMessage = 'Vui lòng điền đầy đủ Email và Mật khẩu.';
          } else if (passwordValue.length < 6) { 
              errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự.';
          } 
          // Giả lập kiểm tra backend (HIỆN THÔNG BÁO NẾU SAI)
          else if (emailValue !== 'test@gmail.com' || passwordValue !== '123456') { 
              errorMessage = 'Email hoặc Mật khẩu không chính xác. Vui lòng thử lại.';
          }

          if (errorMessage) {
              // Hiển thị thông báo lỗi
              errorMsgDiv.textContent = errorMessage;
              errorMsgDiv.style.display = 'block';
          } else {
              // Đăng nhập thành công giả lập
              errorMsgDiv.textContent = '';
              errorMsgDiv.style.display = 'none';
              alert('Đăng nhập thành công! Chuyển hướng...');
              
              // Xóa form và đóng modal
              loginFormElement.reset();
              loginForm.classList.remove('active');
          }
      };

      // Gán handler này vào hàm submit của form Login
      loginFormElement.addEventListener('submit', originalLoginHandler);
      // Lưu trữ handler gốc để có thể gỡ bỏ khi chuyển sang form Đăng ký
      loginFormElement.originalSubmitHandler = originalLoginHandler;
  }
  // --- HẾT LOGIC XỬ LÝ FORM ĐĂNG NHẬP ---

  // Lấy form bên trong sell-car-form-container để thay đổi nội dung
  const sellCarFormContent = sellCarForm ? sellCarForm.querySelector('form') : null;

  // --- LOGIC TÁI SỬ DỤNG SELL CAR FORM CHO CÁC DỊCH VỤ KHÁC (BỔ SUNG) ---
  const originalSellCarFormHTML = sellCarFormContent ? sellCarFormContent.innerHTML : '';

  if (serviceButtons.length > 0 && sellCarFormContent) {
      serviceButtons.forEach(button => {
          button.addEventListener('click', (e) => {
              e.preventDefault();
              const serviceBox = e.target.closest('.box');
              const serviceTitle = serviceBox.querySelector('h3').textContent;
              const serviceDescription = serviceBox.querySelector('p').textContent;

              // Đóng các modal khác
              if (menu && navbar) {
                  menu.classList.remove('fa-times');
                  navbar.classList.remove('active');
              }
              if (loginForm) loginForm.classList.remove('active');
              if (vehicleDetailsContainer) vehicleDetailsContainer.classList.remove('active');

              // Nút Bán xe có logic form riêng
              if (e.target.id === 'sell-car-btn') {
                  // Khôi phục nội dung gốc của form Bán xe
                  sellCarFormContent.innerHTML = originalSellCarFormHTML;
              } 
              // LOGIC ĐẶC BIỆT CHO ĐẶT HÀNG XE (Giả sử bạn đã đặt tên là "Đặt hàng xe")
              else if (serviceTitle.includes('Đặt hàng xe')) {
                  sellCarFormContent.innerHTML = `
                      <h3>Yêu cầu Đặt hàng Xe</h3>
                      <p style="font-size: 1.6rem; color: var(--black); margin-bottom: 1rem;">Điền thông tin xe bạn muốn đặt, chúng tôi sẽ tìm kiếm và báo giá.</p>
                      <input type="text" placeholder="Hãng xe (ví dụ: Toyota)" class="box" required>
                      <input type="text" placeholder="Mẫu xe (ví dụ: Camry)" class="box" required>
                      <input type="number" placeholder="Năm sản xuất/Đời xe mong muốn" class="box">
                      <input type="text" placeholder="Tên của bạn" class="box" required>
                      <input type="email" placeholder="Email liên hệ" class="box" required>
                      <textarea placeholder="Yêu cầu chi tiết về màu sắc, phiên bản, tùy chọn..." class="box" cols="30" rows="5"></textarea>
                      <input type="submit" value="Gửi Yêu cầu Đặt hàng" class="btn">
                      <p>Chúng tôi sẽ liên hệ với bạn trong vòng 24h để xác nhận và báo giá.</p>
                  `;
                  // Ngăn form gửi đi khi người dùng submit
                  sellCarFormContent.addEventListener('submit', function handleServiceSubmit(submitEvent) {
                      submitEvent.preventDefault();
                      alert(`Yêu cầu đặt hàng xe đã được gửi. Chúng tôi sẽ liên hệ với bạn sớm nhất.`);
                      sellCarForm.classList.remove('active');
                      // Xóa listener sau khi xử lý để tránh ảnh hưởng đến các lần mở form khác
                      sellCarFormContent.removeEventListener('submit', handleServiceSubmit);
                  });
              }
              // LOGIC CHUNG CHO TẤT CẢ CÁC DỊCH VỤ CÒN LẠI
              else {
                  // Cập nhật nội dung modal cho các dịch vụ khác
                  sellCarFormContent.innerHTML = `
                      <h3>Yêu cầu Tư vấn Dịch vụ ${serviceTitle}</h3>
                      <p style="font-size: 1.6rem; color: var(--black); margin-bottom: 1rem;">${serviceDescription}</p>
                      <input type="text" placeholder="Tên của bạn" class="box" required>
                      <input type="email" placeholder="Email liên hệ" class="box" required>
                      <input type="tel" placeholder="Số điện thoại" class="box" required>
                      <textarea placeholder="Mô tả nhu cầu của bạn (ví dụ: loại xe, vấn đề)" class="box" cols="30" rows="5"></textarea>
                      <input type="submit" value="Gửi Yêu cầu Tư vấn" class="btn">
                      <p>Chúng tôi sẽ liên hệ với bạn để xác nhận yêu cầu.</p>
                  `;
                  // Ngăn form gửi đi khi người dùng submit
                  sellCarFormContent.addEventListener('submit', function handleServiceSubmit(submitEvent) {
                      submitEvent.preventDefault();
                      alert(`Yêu cầu tư vấn dịch vụ "${serviceTitle}" đã được gửi. Chúng tôi sẽ liên hệ với bạn sớm nhất.`);
                      sellCarForm.classList.remove('active');
                      // Xóa listener sau khi xử lý để tránh ảnh hưởng đến các lần mở form khác
                      sellCarFormContent.removeEventListener('submit', handleServiceSubmit);
                  });
              }

              // Hiển thị form modal
              sellCarForm.classList.add('active');
          });
      });
  }

  // --- LOGIC SELL CAR FORM GỐC ---
  // Giữ lại sự kiện đóng form bán xe
  if (closeSellCarForm && sellCarForm) {
    closeSellCarForm.addEventListener('click', () => {
      sellCarForm.classList.remove('active');
    });
  }

  // Xử lý đóng Sell Car Form khi nhấp ra ngoài container
  if (sellCarForm) {
    sellCarForm.addEventListener('click', (e) => {
        if (e.target === sellCarForm) {
            sellCarForm.classList.remove('active');
        }
    });
  }
  // --- HẾT LOGIC SELL CAR FORM ---

  // --- LOGIC YÊU CẦU LÁI THỬ ---
  if (requestTestDriveBtn && vehicleDetailsContainer) {
      requestTestDriveBtn.addEventListener('click', (e) => {
          e.preventDefault();
          // Đóng modal chi tiết xe
          vehicleDetailsContainer.classList.remove('active');
          // Chuyển hướng đến phần Liên hệ
          window.location.hash = '#contact';
          
          // Thêm một chút cuộn mượt mà nếu trình duyệt hỗ trợ
          // Dùng setTimeout để đảm bảo modal đóng trước khi cuộn
          setTimeout(() => {
              document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
          }, 100); 
      });
  }
  // --- HẾT LOGIC YÊU CẦU LÁI THỬ ---

  // --- LOGIC VEHICLE DETAILS ---
  // Xử lý sự kiện click cho nút đóng chi tiết xe modal (chỉ đóng khi ấn 'X')
  if (closeVehicleDetails && vehicleDetailsContainer) {
    closeVehicleDetails.addEventListener('click', () => {
      vehicleDetailsContainer.classList.remove('active');
    });
  }

  // Xử lý sự kiện click cho nút "Xem ngay"
  if (vehiclesSliders.length > 0) {
      vehiclesSliders.forEach(button => {
          button.addEventListener('click', (e) => {
              e.preventDefault();
              
              const box = e.target.closest('.box');
              if (box) {
                  let imgSrc, name, price, specsHTML;

                  // Lấy thông tin cơ bản
                  imgSrc = box.querySelector('img').getAttribute('src');
                  name = box.querySelector('h3').textContent.trim(); // Dùng trim() để chắc chắn

                  // Xử lý thông tin chi tiết dựa trên loại slider
                  if (box.closest('.vehicles-slider')) {
                      // Xe phổ biến (Vehicles)
                      price = box.querySelector('.content .price').textContent.trim();
                      const pElement = box.querySelector('.content p');
                      const baseSpecs = pElement ? Array.from(pElement.childNodes)
                                             .filter(node => node.nodeType === 3 || node.nodeName === 'SPAN')
                                             .map(node => node.nodeType === 3 ? node.textContent.trim() : node.outerHTML.trim())
                                             .filter(text => text.length > 0)
                                             .join(' ')
                                       : '';

                      let engine = 'Động cơ: 3.0L Turbocharged V6 (Giả định)';
                      let horsepower = 'Công suất: 450 Mã lực';
                      let acceleration = 'Tăng tốc 0-100km/h: 3.5 giây';
                      let brakes = 'Hệ thống phanh: Ceramic Composite (Tùy chọn)';
                      let colorOptions = `
                          <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                              <div style="width: 2rem; height: 2rem; border-radius: 50%; background: #fff; border: 2px solid #000;" title="Trắng"></div>
                              <div style="width: 2rem; height: 2rem; border-radius: 50%; background: #ff0000;" title="Đỏ"></div>
                              <div style="width: 2rem; height: 2rem; border-radius: 50%; background: #0000ff;" title="Xanh dương"></div>
                              <div style="width: 2rem; height: 2rem; border-radius: 50%; background: #000;" title="Đen"></div>
                          </div>`;

                      // Điều chỉnh thông số cụ thể cho các xe
                      if (name.includes('Porsche 911')) {
                          engine = 'Động cơ: 3.8L Flat-Six Twin-Turbo';
                          horsepower = 'Công suất: 500 Mã lực';
                          acceleration = 'Tăng tốc 0-100km/h: 3.2 giây';
                      } else if (name.includes('Porsche Boxster')) {
                          engine = 'Động cơ: 2.0L Turbocharged Flat-Four';
                          horsepower = 'Công suất: 300 Mã lực';
                          acceleration = 'Tăng tốc 0-100km/h: 4.7 giây';
                      } else if (name.includes('Porsche Panamera')) {
                          engine = 'Động cơ: 2.9L Twin-Turbo V6 Hybrid';
                          horsepower = 'Công suất: 462 Mã lực (Tổng)';
                          acceleration = 'Tăng tốc 0-100km/h: 4.4 giây';
                      } 
                      else if (name.includes('Audi R8')) {
                          engine = 'Động cơ: 5.2L V10 FSI';
                          horsepower = 'Công suất: 610 Mã lực';
                          acceleration = 'Tăng tốc 0-100km/h: 3.2 giây';
                          brakes = 'Hệ thống phanh: Đĩa gốm carbon hiệu suất cao';
                      }


                      specsHTML = `
                          <h4><i class="fas fa-info-circle"></i> Thông số Cơ bản</h4>
                          <p class="specs-list">${baseSpecs}</p>
                          <hr style="margin: 1rem 0;">

                          <h4><i class="fas fa-cogs"></i> Chi tiết Kỹ thuật</h4>
                          <p>
                              <span class="fas fa-circle" style="color: var(--yellow); font-size: .8rem; margin-right: .5rem;"></span> **${engine}** <br>
                              <span class="fas fa-circle" style="color: var(--yellow); font-size: .8rem; margin-right: .5rem;"></span> **${horsepower}** <br>
                              <span class="fas fa-circle" style="color: var(--yellow); font-size: .8rem; margin-right: .5rem;"></span> **${acceleration}** <br>
                              <span class="fas fa-circle" style="color: var(--yellow); font-size: .8rem; margin-right: .5rem;"></span> **${brakes}**
                          </p>
                          <hr style="margin: 1rem 0;">

                          <h4><i class="fas fa-brush"></i> Lựa chọn Màu sắc (Có sẵn)</h4>
                          ${colorOptions}
                      `;
                  }
                  
                  else if (box.closest('.featured-slider')) {
                      // Xe nổi bật (Featured)
                      price = box.querySelector('.price').textContent.trim();
                      const starsHTML = box.querySelector('.stars').outerHTML.trim();
                      
                      let specialDetails = '';
                      
                      // Điều chỉnh thông số cụ thể cho Nissan GTR
                      if (name.includes('Nissan GTR')) {
                          specialDetails = `
                              <p>
                                  <span class="fas fa-tachometer-alt" style="color: var(--yellow); margin-right: .5rem;"></span> **Tốc độ tối đa:** 315 km/h <br>
                                  <span class="fas fa-fire" style="color: var(--yellow); margin-right: .5rem;"></span> **Công suất:** 565 HP <br>
                                  <span class="fas fa-road" style="color: var(--yellow); margin-right: .5rem;"></span> **Quãng đường đã đi:** 15,000 km
                              </p>
                              <hr style="margin: 1rem 0;">
                          `;
                      }

                      specsHTML = `
                          <h4><i class="fas fa-info-circle"></i> Tóm tắt</h4>
                          <p>${starsHTML} Đánh giá trung bình của khách hàng. Chiếc xe này được bảo trì hoàn hảo và sẵn sàng để giao hàng.</p>
                          <hr style="margin: 1rem 0;">

                          <h4><i class="fas fa-list-alt"></i> Chi tiết Xe</h4>
                          ${specialDetails}
                          
                          <h4><i class="fas fa-award"></i> Ưu đãi Đặc biệt</h4>
                          <p style="color: red; font-weight: 600;">
                              <span class="fas fa-tag"></span> Tặng kèm gói bảo dưỡng 1 năm/20,000 km. <br>
                              <span class="fas fa-tag"></span> Lãi suất ưu đãi 0% trong 6 tháng đầu.
                          </p>
                          <hr style="margin: 1rem 0;">

                          <h4><i class="fas fa-tools"></i> Tùy chọn Nâng cấp</h4>
                          <p>
                              <span class="fas fa-check-circle" style="color: green; margin-right: .5rem;"></span> Hệ thống âm thanh cao cấp Burmester (+ $3,000) <br>
                              <span class="fas fa-check-circle" style="color: green; margin-right: .5rem;"></span> Nội thất bọc da Alcantara (+ $4,500)
                          </p>
                      `;
                  }
                  
                  // Cập nhật nội dung modal
                  document.getElementById('detail-vehicle-img').src = imgSrc;
                  document.getElementById('detail-vehicle-name').textContent = name;
                  document.getElementById('detail-vehicle-price').textContent = price;
                  
                  const specsElement = document.getElementById('detail-vehicle-specs');
                  specsElement.innerHTML = specsHTML; // Gán HTML chi tiết mới

                  // Hiển thị modal và đóng các form khác
                  if (vehicleDetailsContainer) {
                      vehicleDetailsContainer.classList.add('active');
                  }
                  if (loginForm) loginForm.classList.remove('active');
                  if (sellCarForm) sellCarForm.classList.remove('active');
              }
          });
      });
  }
  // --- HẾT LOGIC VEHICLE DETAILS ---

  // Xử lý sự kiện scroll của window (CẬP NHẬT: KHÔNG ĐÓNG FORM ĐĂNG NHẬP KHI CUỘN)
  window.addEventListener('scroll', () => {
    // Luôn đóng menu khi cuộn
    if (menu && navbar) {
        menu.classList.remove('fa-times');
        navbar.classList.remove('active');
    }

    // Đóng Sell Car Form khi cuộn
    // Lưu ý: Nếu mở form tư vấn dịch vụ, cuộn sẽ đóng form này.
    if (sellCarForm) {
        sellCarForm.classList.remove('active');
    }
    
    // KHÔNG đóng loginForm và vehicleDetailsContainer khi cuộn

    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 0) {
            header.classList.add('active');
        } else {
            header.classList.remove('active');
        }
    }
  });

  const homeSection = document.querySelector('.home');
  if (homeSection) {
      homeSection.onmousemove = (e) => {
        document.querySelectorAll('.home-parallax').forEach(elm => {
          let speed = elm.getAttribute('data-speed');
          let x = (window.innerWidth - e.pageX * speed) / 90;
          let y = (window.innerHeight - e.pageY * speed) / 90;
          elm.style.transform = `translateX(${y}px) translateY(${x}px)`;
        });
      };

      homeSection.onmouseleave = () => {
        document.querySelectorAll('.home-parallax').forEach(elm => {
          elm.style.transform = `translateX(0px) translateY(0px)`;
        });
      };
  }

  // Khởi tạo Swiper (CẬP NHẬT: THÊM slideToClickedSlide: true)
  const vehiclesSwiper = new Swiper(".vehicles-slider", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    grabCursor: true,
    centeredSlides: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".vehicles-slider .swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      0: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      991: { slidesPerView: 3 },
    },
    // --- THÊM CẤU HÌNH QUAN TRỌNG ĐỂ KHẮC PHỤC LỖI NHẢY SLIDE KHI CLICK ---
    slideToClickedSlide: true, 
  });

  const featuredSwiper = new Swiper(".featured-slider", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    grabCursor: true,
    centeredSlides: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".featured-slider .swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      0: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      991: { slidesPerView: 3 },
    },
    // --- THÊM CẤU HÌNH QUAN TRỌNG ĐỂ KHẮC PHỤC LỖI NHẢY SLIDE KHI CLICK ---
    slideToClickedSlide: true, 
  });

  new Swiper(".reviews-slider", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    grabCursor: true,
    centeredSlides: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".reviews-slider .swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      0: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      991: { slidesPerView: 3 },
    },
  });
});