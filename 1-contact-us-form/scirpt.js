  const data = JSON.parse(localStorage.getItem('data')) || []; 
  const toggleSwitch = document.querySelector('#radioButton input');
  let dataBool = false;

  toggleSwitch.addEventListener('change', () => {
    dataBool = toggleSwitch.checked;
  });


  const form = document.getElementById('form');
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const dataObj = {};
    let isValid = true;

    document.querySelectorAll('#form p').forEach(p => p.style.display = 'none');


    for (let i = 0; i < e.target.length; i++) {
      const field = e.target[i];
      const name = field.name;
      const value = field.value?.trim();

      if (!name || field.type === 'submit') continue;

      if (value === "") {
        const error = document.querySelector(`.${name}`);
        if (error) error.style.display = "block";
        isValid = false;
      } else {
        const error = document.querySelector(`.${name}`);
        if (error) error.style.display = "none";
      }
      dataObj.isActive=true;
      dataObj[name] = value;
    }


    const phoneNo = dataObj.phone;
    if (phoneNo && !/^\d{10}$/.test(phoneNo)) {
      const phoneError = document.querySelector('.phone');
      if (phoneError) {
        phoneError.textContent = "Phone number must be exactly 10 digits.";
        phoneError.style.display = "block";
      }
      isValid = false;
    }

    
    const email = dataObj.email;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const emailError = document.querySelector('.email');
      if (emailError) {
        emailError.textContent = "Please enter a valid email address.";
        emailError.style.display = "block";
      }
      isValid = false;
    }

    if (!dataBool) {
      const toggleError = document.querySelector(".toggle");
      if (toggleError) toggleError.style.display = "block";
      isValid = false;
    } else {
      const toggleError = document.querySelector(".toggle");
      if (toggleError) toggleError.style.display = "none";
    }

    if (!isValid) return;


    const countryCode = dataObj.countryCode || "";

    delete dataObj.countryCode; 

  
    data.push(dataObj);
    localStorage.setItem('data', JSON.stringify(data));

    fillTable(data);
    form.reset(); 
    dataBool = false;
    toggleSwitch.checked = false;
  });


  function fillTable(data) {
    const table = document.querySelector(".table");
    table.innerHTML = `
      <tr class="table-header"> 
        <th>First Name</th>
        <th>Last Name</th>
        <th>Company</th>  
        <th>Email</th>
        <th>CountryCode</th>
        <th>Phone No</th>
        <th>Message</th>
        <th>Action</th>
      </tr>`; 

    data.forEach((row, index) => {
      let tr = "<tr>";
      for (const key in row) {
        if(key==='isActive'){
          continue
        }
        tr += `<td>${row[key]}</td>`;
      }
      tr += `<td><button class="delete-btn" data-index="${index}">Delete</button></td>`;
      tr += "</tr>";
      table.innerHTML += tr;
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        data.splice(index, 1);
        localStorage.setItem('data', JSON.stringify(data));
        fillTable(data);
      });
    });
  }


  window.addEventListener('DOMContentLoaded', () => {
    if (data.length > 0) {
      fillTable(data); 
    }
  });
