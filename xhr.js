const wrapper = document.querySelector(".wrapper");
const sourceList = document.querySelector(".source-list");
const tbodyScroll = document.querySelector(".tbody-scroll");
const formSubmit = document.querySelector(".form-submit");
const getBtn = document.getElementById('get-btn');
const postBtn = document.getElementById('post-btn');
const btnMax = document.querySelector('.btn-max');
const btnMin = document.querySelector('.btn-min');
let updateId = null;
const url = 'https://617b71c2d842cf001711bed9.mockapi.io/api/v1/blogs'
//Render
let perPage = 10;
let currentPage = 1;
let start = 0;
let end = perPage;

const btnNext = document.querySelector(".btn-next");
const btnPrev = document.querySelector(".btn-prev");
const myInput = document.getElementById("myInput");

function getCurrentPage(currentPage) {
  start = (currentPage - 1) * perPage;
  end = currentPage * perPage
}

const sendHttpRequest = (method, url, data) => {
  const promise = new Promise((resolve, reject) => {
    const xhr =  new XMLHttpRequest();
    xhr.open(method, url);
   
    xhr.responseType = 'json';
  
    if(data) {
      xhr.setRequestHeader('Content-Type', 'application/json');
    }

    xhr.onload = () => {
      if(xhr.status >= 400) {
        reject(xhr.response);
      }else {
        resolve(xhr.response);
      }
    };
  
    xhr.onerror = () => {
      reject('loi')
    }

    xhr.send(JSON.stringify(data));
  });
  return promise;
 
};
// GET
// PUT
async function updateSource({ id, title, createdAt, image, content }) {
  await sendHttpRequest('PUT', `${url}/${id}`, {
    id,title, createdAt, image, content
  })
}
// Post
async function addPost({ id, title, createdAt, image, content }) {
  await sendHttpRequest('POST', `${url}?page=${currentPage}&limit=${perPage}`, {
    id, title, createdAt, image, content});
}
//Delete
async function deleteSource(id) {
  await sendHttpRequest('DELETE', `${url}/${id}`);
}

async function getSingleSource(id) {
  const response = await fetch(`${url}/${id}`);
  const data = await response.json();
  return data;
}
 

async function getSource() {
  sendHttpRequest('GET', `${url}?page=${currentPage}&limit=${perPage}`).then(data => {
    const product = [...data];  
    let html = "";
     product.map((item, index) => {
      if (index >= start && index < end) {
        html += '<tr class="trbody">';
        html += "<td>" + item.id + "</td>";
        html += "<td>" + item.title + "</td>";
        html += "<td>" + new Date(item.createdAt).toLocaleString() + "</td>";
        html += "<td>" + item.image + "</td>";
        html += "<td>" + item.content;
        html += '<button class="source-edit" data-id =' + item.id + '> <i class="fa fa-list-alt"></i></button>';
        html +='<button class="source-remove" data-id =' + item.id + '><i class="fa fa-times"></i></button>';
        html += "</td>";
        html += "</tr>";
        document.getElementById("product").innerHTML = html;
        return html;
      }
    }); 
    let htmlPage = "";
    let pages = currentPage;  
    htmlPage += `<li class="btn-page-item active"><a href="#">${pages}</a></li>`;
    document.getElementById("number-page").innerHTML = htmlPage;
  }).catch(err => {
    console.log(err, err.message)
  }) 
}
getSource();


//Delete, Edit
tbodyScroll.addEventListener("click", async function (e) { 
  if (e.target.matches(".source-remove")) {
    const id = e.target.dataset.id;
    await deleteSource(id);
  } else if (e.target.matches(".source-edit")) {
    const id = e.target.dataset.id;
    const data = await getSingleSource(id);
    console.log(data);
    wrapper.elements["id"].value = data.id;
    wrapper.elements["title"].value = data.title;
    wrapper.elements["createdAt"].value = data.createdAt;
    wrapper.elements["image"].value = data.id;
    wrapper.elements["content"].value = data.id;
    formSubmit.textContent = "Update";
    updateId = id;
  }
});

// Submit
wrapper.addEventListener("submit", async function (e) {
  e.preventDefault();
  const source = {
    id: this.elements["id"].value,
    title: this.elements["title"].value,
    createdAt: this.elements["createdAt"].value,
    image: this.elements["image"].value,
    content: this.elements["content"].value,
  };
    updateId
      ? await updateSource({ id: updateId, ...source })
      : await addPost(source);
      this.reset();
      await getSource()
    });

    myInput.addEventListener('change', () => {
      perPage = myInput.value;
      getClick();
    })

  function getClick() {
   sendHttpRequest('GET', url).then(data => {
      
    let pages = currentPage;
    let totalPages = Math.ceil(data.length / perPage);
    console.log(data.length);
    console.log(totalPages);
    btnNext.addEventListener("click", () => {
      currentPage++;
      pages++;
      if (currentPage >= totalPages) {
        currentPage = totalPages;
        btnNext.classList.add("activeFilter");
        }
      btnPrev.classList.remove("activeFilter");
      getSource();  
    });
      btnMax.addEventListener("click", () => {
       currentPage = totalPages;
       btnNext.classList.add("activeFilter");
       btnPrev.classList.remove("activeFilter");
       getSource();
     })

    btnPrev.addEventListener("click", () => {
      currentPage--;
      pages--;
      if (currentPage < 1) {
        currentPage = 1;
      }
      btnNext.classList.remove("activeFilter");
      getSource();
    });
    btnMin.addEventListener("click", () => {
      currentPage = 1;
      btnPrev.classList.add("activeFilter");
      btnNext.classList.remove("activeFilter");
      getSource();
    })
  })
  }
getClick();
