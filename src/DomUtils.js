export function getList(){
    const favoritesItem = document.querySelectorAll('[data-cy-files-navigation-item="favorites"]');
    return favoritesItem.item(0).children.item(1);
}