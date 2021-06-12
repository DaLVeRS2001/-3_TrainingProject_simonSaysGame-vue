
 export function getItems() {
    return [...document.querySelectorAll(".part")];
  }
 export function updateItems(opacity) {
   getItems().forEach(item => {
     item.style.opacity = opacity + '%';
   })
}

