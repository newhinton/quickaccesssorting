/**
 * @copyright Copyright (c) 2023, Felix Nüsse
 *
 * @author Felix Nüsse <felix.nuesse@t-online.de>
 *
 * @license AGPL-3.0
 *
 * This code is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License, version 3,
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 *
 */




import Vue from 'vue'
import Settings from './Settings.vue'
import Sortable from "sortablejs";


// Setup of settings

Vue.mixin({ methods: { t, n } })

const FileSettings = new Vue({
    render: h => h(Settings, {}),
})
const element = FileSettings.$mount().$el

OCA.Files.Settings.register(new OCA.Files.Settings.Setting('quickaccesssorting', {
    el: () => { return element },
}))

// Setup of Sidebar

const favoritesItem = document.querySelectorAll('[data-cy-files-navigation-item="favorites"]');
const favoritesList = favoritesItem.item(0).children.item(1);

function setHandle(handling) {
    const favoritesListItems = favoritesList.children;
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

Sortable.create(favoritesList, {
    animation: 200,
    // Element dragging started
    onStart: function (/**Event*/evt) {
        setHandle(true)
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
        setHandle(false)
    },

    // Changed sorting within list
    onUpdate: function (/**Event*/evt) {
        // same properties as onEnd
    },
});
