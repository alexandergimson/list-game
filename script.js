// Sample data (replace this with data from your backend)
const listData = {
    title: "Fruits",
    description: "Arrange the fruits in alphabetical order",
    items: [
        { name: "Apple", position: 1 },
        { name: "Banana", position: 2 },
        { name: "Orange", position: 3 },
        { name: "Pineapple", position: 4 },
        // Add more items as needed
    ]
};

// Shuffle the items randomly
listData.items = shuffleArray(listData.items);

// Display list title and description
document.getElementById("list-title").innerText = listData.title;
document.getElementById("list-description").innerText = listData.description;

// Create and append items to the items container
const itemsContainer = document.getElementById("items-container");
listData.items.forEach(itemData => {
    const item = document.createElement("div");
    item.classList.add("item");
    item.innerText = itemData.name;
    item.dataset.position = itemData.position; // Store position in the dataset
    itemsContainer.appendChild(item);

    // Add touch event listeners
    item.addEventListener("touchstart", touchStart, false);
    item.addEventListener("touchmove", touchMove, false);
    item.addEventListener("touchend", touchEnd, false);
});

let touchItem = null;

function touchStart(e) {
    touchItem = e.target;
    e.preventDefault();
}

function touchMove(e) {
    if (!touchItem) return;
    e.preventDefault();

    const touch = e.touches[0];
    touchItem.style.left = touch.clientX + "px";
    touchItem.style.top = touch.clientY + "px";
}

function touchEnd(e) {
    if (!touchItem) return;
    e.preventDefault();

    const dropzone = document.elementFromPoint(touchItem.getBoundingClientRect().x, touchItem.getBoundingClientRect().y);
    if (dropzone && dropzone.classList.contains("item")) {
        // Swap positions
        const temp = touchItem.dataset.position;
        touchItem.dataset.position = dropzone.dataset.position;
        dropzone.dataset.position = temp;
    }

    touchItem.style.left = "";
    touchItem.style.top = "";
    touchItem = null;
}

// Function to check the order when the user clicks the "Check Order" button
function checkOrder() {
    const items = Array.from(document.querySelectorAll('.item'));

    const isCorrectOrder = items.every((item, index) => {
        const position = parseInt(item.dataset.position);
        return position === index + 1;
    });

    const messageElement = document.getElementById("message");

    if (isCorrectOrder) {
        messageElement.innerText = "Congratulations! The order is correct.";
    } else {
        messageElement.innerText = "Oops! The order is incorrect. Please try again.";
    }
}

// Function to shuffle an array randomly
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
