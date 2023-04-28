import {getCompareValue} from "./Quicksort";
import Sortable from "sortablejs";


export function instantiateSortable(list) {
    const sortable = Sortable.create(list, {
        animation: 200,
        // Element dragging started
        onStart: function (/**Event*/evt) {
            setHandle(true, list)
        },

        // Element dragging ended
        onEnd: function (/**Event*/evt) {
            var itemEl = evt.item;  // dragged HTMLElement
            evt.to;    // target list
            evt.from;  // previous list
            evt.oldIndex;  // element's old index within old parent
            evt.newIndex;  // element's new index within new parent
            evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
            evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
            evt.clone // the clone element
            evt.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving
            setHandle(false, list)
        },

        // Changed sorting within list
        onUpdate: function (/**Event*/evt) {
            setOrder(list.children)
        },
    });
}

export function setOrder(list) {
    const string = [];
    for (let j = 0; j < list.length; j++) {
        const Object = {
            id: j,
            name: getCompareValue(list, j, 'alphabet')
        };
        string.push(Object);
    }
    const resultOrder = JSON.stringify(string);
    console.log(resultOrder)
    $.get(OC.generateUrl("/apps/quickaccesssorting/api/v1/set/CustomSortingOrder"), {order: resultOrder}, function (data, status) {});
}


export function setHandle(handling, list) {
    const favoritesListItems = list.children;
    for (var j = 0; j < favoritesListItems.length; j++) {
        if (!(typeof favoritesListItems[j].getElementsByTagName('a')[0] === 'undefined')) {
            var item = favoritesListItems[j].getElementsByClassName('app-navigation-entry-icon icon-folder')[0];
            if(handling) {
                item.classList.remove("icon-folder");
                item.classList.add('icon-menu');
            } else {
                item.classList.remove("icon-menu");
                item.classList.add('icon-folder');
            }
        }
    }
}