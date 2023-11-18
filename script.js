// Sample data (replace this with data from your backend)
const listData = {
    title: "Elvis songs",
    description: "Arrange the songs in year released (starting with the oldest)",
    items: [
        { name: "Heartbreak Hotel", position: 1 },
        { name: "Paralyzed", position: 2 },
        { name: "Are You Lonesome Tonight?", position: 3 },
        { name: "Crying in the Chapel", position: 4 },
        { name: "Burning Love", position: 5 },

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
listData.items.forEach((itemData) => {
    const item = document.createElement("div");
    item.classList.add("item");
    item.setAttribute("draggable", "true");
    item.innerText = itemData.name;
    item.dataset.position = itemData.position; // Store position in the dataset
    itemsContainer.appendChild(item);
});

// Function to check the order when the user clicks the "Check Order" button
function checkOrder() {
    const items = Array.from(document.querySelectorAll(".item"));

    const isCorrectOrder = items.every((item, index) => {
        const position = parseInt(item.dataset.position);
        return position === index + 1;
    });

    const messageElement = document.getElementById("message");

    if (isCorrectOrder) {
        messageElement.innerText = "Congratulations! The order is correct.";
    } else {
        messageElement.innerText =
            "Oops! The order is incorrect. Please try again.";
    }
}

// Add drag and drop functionality
const draggables = document.querySelectorAll(".item");
const containers = document.querySelectorAll(".items-container");

draggables.forEach((draggable) => {
    let isDragging = false;
    let touchStartX, touchStartY;

    draggable.addEventListener("dragstart", () => {
        isDragging = true;
        draggable.classList.add("dragging");
    });

    draggable.addEventListener("dragend", () => {
        isDragging = false;
        draggable.classList.remove("dragging");
    });

    draggable.addEventListener("touchstart", (e) => {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;

        // Prevent the default touch behavior to avoid conflicts
        e.preventDefault();
        e.stopPropagation();
    });

    draggable.addEventListener("touchmove", (e) => {
        if (!isDragging) {
            return;
        }

        const touch = e.touches[0];
        const offsetX = touch.clientX - touchStartX;
        const offsetY = touch.clientY - touchStartY;

        // Move the dragged item
        draggable.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

        // Prevent the default touch behavior to avoid conflicts
        e.preventDefault();
        e.stopPropagation();
    });

    draggable.addEventListener("touchend", (e) => {
        if (!isDragging) {
            return;
        }

        isDragging = false;

        // Reset the transform property
        draggable.style.transform = "";

        // Trigger a dragend event to ensure correct behavior
        const dragEndEvent = new Event("dragend");
        draggable.dispatchEvent(dragEndEvent);

        // Prevent the default touch behavior to avoid conflicts
        e.preventDefault();
        e.stopPropagation();
    });
});

containers.forEach((container) => {
    container.addEventListener("dragover", (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        const draggable = document.querySelector(".dragging");
        if (afterElement == null) {
            container.appendChild(draggable);
        } else {
            container.insertBefore(draggable, afterElement);
        }
    });
});

function getDragAfterElement(container, y) {
    const draggableElements = [
        ...container.querySelectorAll(".item:not(.dragging)"),
    ];

    return draggableElements.reduce(
        (closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        },
        { offset: Number.NEGATIVE_INFINITY }
    ).element;
}

// Function to shuffle an array randomly
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
