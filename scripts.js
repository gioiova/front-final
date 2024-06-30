async function getNews() {
    const apiURL = "https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news";
    const response = await fetch(apiURL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const tableBody = document.getElementById("newsList");

    const responseData = await response.json();

    responseData.forEach((news) => {
        initNewsLocal(news);
    });

    initEvents();
}

async function deleteNews(newsId) {
    const apiURL = `https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news/${newsId}`;
    await fetch(apiURL, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
}

async function handleDelete(e) {
    const newsId = e.target.getAttribute("data-id");
    const row = document.getElementById(`row_${newsId}`);

    row.classList.add("deleting");

    row.addEventListener("transitionend", async function() {
        await deleteNews(newsId);
        row.remove();
    }, { once: true });
}

async function updateNews(event) {
    event.preventDefault();

    const newsId = new URLSearchParams(window.location.search).get('id');
    const apiURL = `https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news/${newsId}`;

    const editorFirstName = document.getElementById("firstName").value;
    const editorLastName = document.getElementById("lastName").value;
    const description = document.getElementById("description").value;
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;

    console.log("Form data:", { editorFirstName, editorLastName, description, title, category });

    try {
        const response = await fetch(apiURL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                editorFirstName,
                editorLastName,
                description,
                title,
                category,
            }),
        });

        console.log("Response status:", response.status);

        if (response.ok) {
            console.log("news updated successfully");
            window.location.href = 'index.html';
        } else {
            const errorData = await response.json();
            console.error('error updating news:', errorData);
            alert('error updating news: ' + JSON.stringify(errorData));
        }
    } catch (error) {
        console.error('error updating news:', error);
        alert('error updating news: ' + error.message); 
    }
}

function handleUpdate(e) {
    const newsId = e.target.getAttribute("data-id");
    window.location.href = `update_news.html?id=${newsId}`;
}

async function createNews(event) {
    event.preventDefault();

    const apiURL = "https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news";

    const editorFirstName = document.getElementById("firstName").value;
    const editorLastName = document.getElementById("lastName").value;
    const description = document.getElementById("description").value;
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;

    console.log("Form data:", { editorFirstName, editorLastName, description, title, category });

    try {
        const response = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                editorFirstName,
                editorLastName,
                description,
                title,
                category,
            }),
        });

        console.log("Response status:", response.status);

        if (response.ok) {
            console.log("news created successfully");
            window.location.href = 'index.html';
        } else {
            const errorData = await response.json();
            console.error('error creating news:', errorData);
            alert('error creating news: ' + JSON.stringify(errorData));
        }
    } catch (error) {
        console.error('error creating news:', error);
        alert('error creating news: ' + error.message); 
    }
}

function initNewsLocal(news) {
    const tableBody = document.getElementById("newsList");

    const tableRow = document.createElement("tr");
    tableRow.id = `row_${news.id}`;

    const tableCell1 = document.createElement("td");
    tableCell1.innerHTML = news.id;

    const tableCell2 = document.createElement("td");
    tableCell2.innerHTML = news.title;

    const tableCell3 = document.createElement("td");
    tableCell3.innerHTML = news.category;

    const tableCell4 = document.createElement("td");
    tableCell4.innerHTML = news.likes;

    const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

    const tableCell5 = document.createElement("td");
    tableCell5.innerHTML = news.dateUpdated ? dateFormatter.format(new Date(news.dateUpdated)) : 'undefined';

    const tableCell6 = document.createElement("td");
    tableCell6.innerHTML = news.dateCreated ? dateFormatter.format(new Date(news.dateCreated)) : 'undefined';

    const tableCell7 = document.createElement("td");

    const btnUpdate = document.createElement("button");
    btnUpdate.classList.add("btn-action");
    btnUpdate.setAttribute("data-id", news.id);
    btnUpdate.innerHTML = "Update";

    const btnDelete = document.createElement("button");
    btnDelete.classList.add("btn-delete");
    btnDelete.setAttribute("data-id", news.id);
    btnDelete.innerHTML = "Delete";

    tableCell7.appendChild(btnUpdate);
    tableCell7.appendChild(btnDelete);

    tableRow.appendChild(tableCell1);
    tableRow.appendChild(tableCell2);
    tableRow.appendChild(tableCell3);
    tableRow.appendChild(tableCell4);
    tableRow.appendChild(tableCell5);
    tableRow.appendChild(tableCell6);
    tableRow.appendChild(tableCell7);

    tableBody.appendChild(tableRow);
}

function initEvents() {
    const deleteButtons = document.getElementsByClassName("btn-delete");
    Array.from(deleteButtons).forEach((btnDelete) => {
        btnDelete.addEventListener("click", handleDelete);
    });

    const updateButtons = document.getElementsByClassName("btn-action");
    Array.from(updateButtons).forEach((btnUpdate) => {
        btnUpdate.addEventListener("click", handleUpdate);
    });
}



async function fetchNewsDetails(newsId) {
    const apiURL = `https://btu-exam-cb6c3fdf3b9d.herokuapp.com/news/${newsId}`;
    const response = await fetch(apiURL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        const news = await response.json();
        document.getElementById("title").value = news.title;
        document.getElementById("description").value = news.description;
        document.getElementById("category").value = news.category;
        document.getElementById("firstName").value = news.editorFirstName;
        document.getElementById("lastName").value = news.editorLastName;
    } else {
        console.error("Failed to fetch news details");
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    if (document.getElementById("newsList")) {
        await getNews();
    }

    const addNewsForm = document.getElementById("addNewsForm");
    if (addNewsForm) {
        addNewsForm.addEventListener("submit", createNews);
    }

    const updateNewsForm = document.getElementById("updateNewsForm");
    if (updateNewsForm) {
        updateNewsForm.addEventListener("submit", updateNews);
        
        const newsId = new URLSearchParams(window.location.search).get('id');
        if (newsId) {
            await fetchNewsDetails(newsId);
        }
    }
});
